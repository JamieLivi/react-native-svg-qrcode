# react-native-svg-qrcode

A minimal dependency QR Code generator for React Native which works across iOS, Android and Web.

Based on [react-native-qrcode-svg](https://github.com/Expensify/react-native-qrcode-svg) but without any dependencies and just a single peer dependency - [react-native-svg](https://github.com/software-mansion/react-native-svg).

Perfect for folks who already use `react-native-svg` in their project and want QR code functionality without bloating their bundle size.

Written in TypeScript.

## Installation

```bash
yarn add react-native-svg react-native-qrcode-svg
```

## Usage

```jsx
const QR_CODE_SIZE = 262;
const QR_LOGO_SIZE = 70;

const App = () => {
  return (
    <View style={styles.container}>
      <QRCode
        size={QR_CODE_SIZE}
        value={'insert address'}
        logo={require('../assets/black_r_logo.png')}
        logoSize={QR_LOGO_SIZE}
      />
    </View>
  );
};
```

## Props

| Name                 | Default                                           | Description                                                                                                               |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| size                 | 100                                               | Size of rendered image in pixels                                                                                          |
| value                | 'this is a QR code'                               | Value of the QR code.                                                                                                     |
| color                | 'black'                                           | Color of the QR code                                                                                                      |
| backgroundColor      | 'white'                                           | Color of the background                                                                                                   |
| enableLinearGradient | false                                             | enables or disables linear gradient                                                                                       |
| linearGradient       | ['rgba(0, 73, 255, 1)', 'rgba(255, 255, 255, 1)'] | array of 2 rgb colors used to create the linear gradient                                                                  |
| gradientDirection    | [170,0,0,0]                                       | the direction of the linear gradient                                                                                      |
| logo                 | null                                              | Image source object. Ex. {uri: 'base64string'} or {require('pathToImage')}                                                |
| logoSize             | 20% of size                                       | Size of the imprinted logo. Bigger logo = less error correction in QR code                                                |
| logoBackgroundColor  | backgroundColor                                   | The logo gets a filled quadratic background with this color. Use 'transparent' if your logo already has its own backdrop. |
| logoMargin           | 2                                                 | logo's distance to its wrapper                                                                                            |
| logoBorderRadius     | 0                                                 | the border-radius of logo image (Android is not supported)                                                                |
| quietZone            | 0                                                 | quiet zone around the qr in pixels (useful when saving image to gallery)                                                  |
| ecl                  | 'M'                                               | Error correction level                                                                                                    |
| onError(error)       | undefined                                         | Callback fired when exception happened during the code generating process                                                 |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
