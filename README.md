# 📱 react-native-adb-control

TypeScript React Native library to control Android devices from your app.

## Install
```bash
npm install react-native-adb-control
```

## Usage
```typescript
import ADBClient from 'react-native-adb-control';

// Get device info
const info = await ADBClient.getDeviceInfo();
console.log(info.model, info.androidVersion);

// List packages
const apps = await ADBClient.listPackages(true); // user-only

// Install APK
await ADBClient.installAPK('/path/to/app.apk', true);

// Control screen
await ADBClient.tap(540, 960);
await ADBClient.swipe(540, 1500, 540, 500, 300);

// Launch app
await ADBClient.launch('com.example.app');

// Listen for device events
ADBClient.onDeviceConnected((serial) => {
  console.log("Device connected:", serial);
});
```

Perfect for mobile testing automation, device administration, and ADB-driven tooling.
