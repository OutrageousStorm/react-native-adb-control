# 📱 react-native-adb-control

Control Android devices via ADB from React Native apps. Perfect for device management dashboards, testing automation, or fleet control.

## Install
```bash
npm install react-native-adb-control
```

## Usage
```javascript
import ADBControl from 'react-native-adb-control';

const device = new ADBControl({ serial: '192.168.1.100:5555' });

// Execute shell command
const result = await device.shell('getprop ro.product.model');
console.log(result); // "Samsung Galaxy S21"

// Install APK
await device.install('/path/to/app.apk');

// Launch app
await device.launch('com.example.app');

// Take screenshot
const screenshot = await device.screencap();
```
