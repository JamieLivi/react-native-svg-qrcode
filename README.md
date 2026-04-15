# react-native-svg-qrcode

A minimal dependency QR Code generator for React Native which works across iOS, Android and Web.

Based on [react-native-qrcode-svg](https://github.com/Expensify/react-native-qrcode-svg) but without any dependencies and just a single peer dependency - [react-native-svg](https://github.com/software-mansion/react-native-svg).

Perfect for folks who already use `react-native-svg` in their project and want QR code functionality without bloating their bundle size.

Written in TypeScript.

## Installation

```bash
yarn add react-native-svg react-native-svg-qrcode
```

or

```bash
npm install react-native-svg react-native-svg-qrcode
```

## Usage

```tsx
import { QRCode } from 'react-native-svg-qrcode';

const App = () => (
  <QRCode
    size={262}
    value="https://example.com"
    logo={require('./assets/logo.png')}
    logoSize={70}
  />
);
```

### SVG Logo

You can use an SVG string, URL, or local asset as the logo instead of a raster image:

```tsx
// Inline SVG string
<QRCode value="https://example.com" logoSVG="<svg>...</svg>" logoSize={50} />

// Remote SVG URL
<QRCode value="https://example.com" logoSVG="https://example.com/logo.svg" logoSize={50} />

// Local SVG asset (via require)
<QRCode value="https://example.com" logoSVG={require('./assets/logo.svg')} logoSize={50} />
```

### Linear Gradient

```tsx
<QRCode
  value="https://example.com"
  size={200}
  enableLinearGradient
  linearGradient={['#FF0000', '#0000FF']}
  gradientDirection={['0%', '0%', '100%', '100%']}
/>
```

### Error Handling

```tsx
<QRCode
  value="https://example.com"
  onError={(error) => console.error('QR generation failed:', error)}
/>
```

## Props

| Name                 | Type                   | Default                                            | Description                                                              |
| -------------------- | ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| value                | `string`               | `'this is a QR code'`                              | Value to encode in the QR code                                           |
| size                 | `number`               | `100`                                              | Size of rendered image in pixels                                         |
| color                | `string`               | `'black'`                                          | Color of the QR code                                                     |
| backgroundColor      | `string`               | `'white'`                                          | Background color                                                         |
| logo                 | `string`               | `undefined`                                        | Raster image source (PNG/JPG via `require()` or URI)                     |
| logoSVG              | `string \| number`     | `undefined`                                        | SVG logo as inline XML string, remote URL, or local asset via `require()`|
| logoSize             | `number`               | `20% of size`                                      | Size of the logo. Bigger logo = less error correction                    |
| logoBackgroundColor  | `string`               | `backgroundColor`                                  | Background color behind the logo                                         |
| logoColor            | `string`               | `undefined`                                        | Fill color applied to SVG logos                                          |
| logoMargin           | `number`               | `2`                                                | Margin around the logo                                                   |
| logoBorderRadius     | `number`               | `0`                                                | Border radius of the logo area                                           |
| quietZone            | `number`               | `0`                                                | Quiet zone (padding) around the QR code in pixels                        |
| enableLinearGradient | `boolean`              | `false`                                            | Enable linear gradient on the QR code                                    |
| linearGradient       | `string[]`             | `['rgba(0,73,255,1)', 'rgba(255,255,255,1)']`      | Array of 2 colors for the gradient                                       |
| gradientDirection    | `string[]`             | `['0%', '0%', '100%', '100%']`                     | Gradient direction as `[x1, y1, x2, y2]`                                 |
| ecl                  | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`                                        | Error correction level                                                   |
| onError              | `(error: Error) => void` | `undefined`                                      | Callback when QR generation fails                                        |
| testID               | `string`               | `undefined`                                        | Test ID for the SVG element                                              |

## Peer Dependencies

- `react` - any version
- `react-native` - any version
- `react-native-svg` - >= 15

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
