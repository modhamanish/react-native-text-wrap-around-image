# React Native Text Wrap Around Image

A persistent and flexible React Native component that allows you to wrap text around images, supporting floating layouts, circular shapes, and rich customization. It leverages `react-native-webview` for high-performance rendering of complex text flows.

![Demo](https://raw.githubusercontent.com/modhamanish/react-native-text-wrap-around-image/refs/heads/main/demo/image.png)

## Features

- 📄 **Text Wrapping**: Wrap text around images on the left or right.
- 🖼️ **Image Shapes**: Support for rectangular and circular images.
- 🎨 **Rich Styling**: Customize fonts, colors, margins, and more for titles, text, and images.
- 🌓 **Dark Mode Support**: Built-in support for dark mode adaptation.
- 🌍 **RTL Support**: Ready for Right-to-Left languages.
- 🔗 **Click Events**: Handle interactions with sections.
- 📡 **Remote Data**: Fetch sections content directly from an API.

## Installation

```bash
npm install @modhamanish/react-native-text-wrap-around-image react-native-webview
# or
yarn add @modhamanish/react-native-text-wrap-around-image react-native-webview
```

*> Note: This package depends on `react-native-webview`. Make sure to follow its [installation guide](https://github.com/react-native-webview/react-native-webview) for native dependencies.*

## Usage

### Basic Example

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import TextWrapAroundImage, { WrapSection } from '@modhamanish/react-native-text-wrap-around-image';

const App = () => {
  const sections: WrapSection[] = [
    {
      id: "1",
      title: "Beautiful Landscapes",
      titleStyle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333"
      },
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
      text: "This is a long paragraph that will wrap around the image. The image is floating to the left, and the text flows naturally around it, creating a magazine-like layout experience directly in your React Native app.",
      floatSide: "left",
      isCircle: true,
      imageStyle: {
        width: 100,
        height: 100,
        margin: "0 15px 5px 0"
      },
      textStyle: {
        fontSize: 16,
        color: "#555"
      }
    },
    {
      id: "2",
      title: "Modern Architecture",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400",
      text: "You can also float images to the right. This allows for diverse layout options. The component handles HTML rendering efficiently ensuring smooth performance.",
      floatSide: "right",
      sectionStyle: {
        margin: "20px 0"
      }
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextWrapAroundImage 
        sections={sections}
        enableDarkMode={true}
        onItemClick={(item) => console.log('Clicked:', item.title)}
      />
    </SafeAreaView>
  );
};

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `WrapSection[]` | `[]` | Array of data sections to render. |
| `apiUrl` | `string` | `undefined` | URL to fetch sections data from remotely. |
| `rtl` | `boolean` | `false` | Enable Right-to-Left text direction. |
| `enableDarkMode` | `boolean` | `true` | Automatically adjust colors for system dark mode (can be overridden by styles). |
| `onItemClick` | `(section) => void` | `undefined` | Callback when a section text is clicked. |

## Data Structure: `WrapSection`

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the section. |
| `title` | `string` | Title text for the section (optional). |
| `titleStyle` | `object` | Styling for the title (color, fontSize, margin, etc.). |
| `image` | `string` | URL of the image. |
| `text` | `string` | Main content text. |
| `isCircle` | `boolean` | If true, renders the image as a circle using `shape-outside`. |
| `floatSide` | `'left' \| 'right'` | Side to float the image. |
| `sectionStyle` | `object` | Container styles for the section (margin, padding, background). |
| `imageStyle` | `object` | Styles specifically for the image (width, height, borderRadius, margin). |
| `textStyle` | `object` | Styles for the paragraph text. |

## License

ISC
