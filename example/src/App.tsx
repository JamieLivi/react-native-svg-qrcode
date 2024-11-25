import { StyleSheet, View } from 'react-native';
import { QRCode } from 'react-native-svg-qrcode';

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

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
