/**
 * example.js - Example usage of the ADB wrapper
 * Run: node example.js
 */

const adb = require('./lib/adb');

async function main() {
  try {
    console.log('\n📱 ADB Control Example');
    console.log('='.repeat(40));

    // Get devices
    const devices = await adb.devices();
    console.log(`\nConnected devices: ${devices.join(', ') || 'None'}`);

    if (devices.length === 0) {
      console.log('No devices connected.');
      return;
    }

    // Get device info
    const model = await adb.getPropertyValue('ro.product.model');
    const android = await adb.getPropertyValue('ro.build.version.release');
    console.log(`\nDevice: ${model} (Android ${android})`);

    // List packages
    const pkgs = await adb.shell('pm list packages -3');
    const count = pkgs.split('\n').length;
    console.log(`User packages: ${count}`);

    // Take screenshot
    console.log('\n📸 Taking screenshot...');
    const screenPath = await adb.takeScreenshot('./device_screenshot.png');
    console.log(`  Saved to: ${screenPath}`);

    // Tap and swipe example
    console.log('\n👆 Demonstrating input:');
    await adb.tapScreen(540, 960);
    console.log('  Tapped (540, 960)');

    await adb.swipe(540, 1500, 540, 500, 400);
    console.log('  Swiped up');

    // Type text
    await adb.typeText('Hello from Node.js!');
    console.log('  Typed text');

    console.log('\n✅ Done!');
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

main();
