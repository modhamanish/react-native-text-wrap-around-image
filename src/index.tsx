import React, { FC, useMemo, useEffect, useState, memo } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";

export interface WrapSection {
  id?: string;

  title?: string;

  titleStyle?: {
    color?: string;
    fontSize?: number;
    textAlign?: "left" | "right" | "center" | "justify";
    fontFamily?: string;
    margin?: string;
    fontWeight?: string;
  };

  image: string;
  text: string;

  isCircle?: boolean;
  floatSide?: "left" | "right";

  sectionStyle?: {
    margin?: string;
    padding?: number;
    background?: string;
    borderRadius?: number;
  };

  imageStyle?: {
    width?: number;
    height?: number;
    borderRadius?: number;
    margin?: string;
  };

  textStyle?: {
    color?: string;
    fontSize?: number;
    textAlign?: "left" | "right" | "center" | "justify";
    fontFamily?: string;
    margin?: string;
  };
}

interface Props {
  sections?: WrapSection[];
  apiUrl?: string;
  rtl?: boolean;
  enableDarkMode?: boolean;
  onItemClick?: (section: WrapSection) => void;
}

const sanitize = (text: string) =>
  text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");

const TextWrapAroundImage: FC<Props> = ({
  sections = [],
  apiUrl,
  rtl = false,
  enableDarkMode = true,
  onItemClick,
}) => {
  const sys = useColorScheme();
  const isDark = enableDarkMode && sys === "dark";

  const [data, setData] = useState(sections);
  const [webHeight, setWebHeight] = useState(200);

  useEffect(() => setData(sections), [sections]);

  useEffect(() => {
    if (!apiUrl) return;
    (async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        setData(json?.sections || []);
      } catch {}
    })();
  }, [apiUrl]);

  const html = useMemo(
    () => `
<!DOCTYPE html>
<html dir="${rtl ? "rtl" : "ltr"}">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

body{
  margin:0;
  background: transparent;
  user-select:text;
}

.section{
  overflow:auto;
  animation:fade .3s ease;
}

@keyframes fade{
 from{opacity:0; transform:translateY(5px)}
 to{opacity:1; transform:translateY(0)}
}

.left{float:left;}
.right{float:right;}

.circle{
  shape-outside:circle();
}

.lazy{
 filter:blur(8px);
 opacity:.7;
}

</style>

<script>

function send(type,extra){
 window.ReactNativeWebView.postMessage(JSON.stringify({type,...extra}))
}

const observe = new IntersectionObserver((entries)=>{
 entries.forEach(e=>{
  if(e.isIntersecting){
    const img=e.target;
    img.src=img.dataset.src;
    img.classList.remove("lazy")
  }
 })
})

function sendHeight(){
 const h=document.body.scrollHeight;
 send("HEIGHT",{height:h});
}
window.onload=sendHeight;
window.addEventListener("resize",sendHeight);
setTimeout(sendHeight,500);

</script>

</head>

<body>

${data
  .map(
    (s, i) => `
<div
 class="section"
 style="
 margin:${s.sectionStyle?.margin ?? "0px"};
 padding:${s.sectionStyle?.padding ?? "0px"};
 background:${s.sectionStyle?.background ?? "transparent"};
 border-radius:${s.sectionStyle?.borderRadius ?? 0}px;
">

${
  s.title
    ? `<h2 style="
      color:${s.titleStyle?.color || (isDark ? "#fff" : "#000")};
      font-size:${s.titleStyle?.fontSize || 20}px;
      font-family:${s.titleStyle?.fontFamily || "Arial"};
      text-align:${s.titleStyle?.textAlign || (rtl ? "right" : "left")};
      margin:${s.titleStyle?.margin || "0 0 10px 0"};
      font-weight:${s.titleStyle?.fontWeight || "bold"};
      clear:both;
    ">${sanitize(s.title)}</h2>`
    : ""
}

<img
 data-src="${s.image}"
 class="${s.floatSide || "left"} ${s.isCircle ? "circle" : ""} lazy"
 width="${s.imageStyle?.width || 220}"
 height="${s.imageStyle?.height || 220}"
 style="
   border-radius:${s.imageStyle?.borderRadius ?? (s.isCircle ? 999 : 0)}px;
   margin:${s.imageStyle?.margin ?? "0px"};
   object-fit:cover;
"
/>

<p
 onclick="send('CLICK',{id:'${s.id || i}'})"
 style="
 color:${s.textStyle?.color || (isDark ? "#fff" : "#000")};
 font-size:${s.textStyle?.fontSize || 14}px;
 font-family:${s.textStyle?.fontFamily || "Arial"};
 text-align:${s.textStyle?.textAlign || (rtl ? "right" : "left")};
 margin:${s.textStyle?.margin || "0px"};
 ">
 ${sanitize(s.text)}
</p>

</div>
`
  )
  .join("")}

<script>
document.querySelectorAll("img").forEach(img=>observe.observe(img));
</script>

</body>
</html>
`,
    [data, rtl, isDark]
  );

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        scrollEnabled={false}
        style={{ height: webHeight, backgroundColor: "transparent" }}
        onMessage={(e) => {
          const m = JSON.parse(e.nativeEvent.data);

          if (m.type === "HEIGHT") {
            setWebHeight(m.height + 20);
            return;
          }

          if (m.type === "CLICK" && onItemClick) {
            const sec = data.find((x) => (x.id || "") === m.id);
            if (sec) onItemClick(sec);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default memo(TextWrapAroundImage);
