/**
 * react-native-adb-control
 * Control Android devices via ADB from React Native
 */

const { execSync } = require('child_process');

class ADBControl {
  constructor(options = {}) {
    this.serial = options.serial || null;
    this.timeout = options.timeout || 5000;
  }

  exec(cmd) {
    const fullCmd = this.serial ? `adb -s ${this.serial} ${cmd}` : `adb ${cmd}`;
    try {
      return execSync(fullCmd, { timeout: this.timeout, encoding: 'utf-8' }).trim();
    } catch (e) {
      throw new Error(`ADB command failed: ${e.message}`);
    }
  }

  async shell(command) {
    return this.exec(`shell ${command}`);
  }

  async getDeviceInfo() {
    return {
      model: await this.shell('getprop ro.product.model'),
      android: await this.shell('getprop ro.build.version.release'),
      serial: this.serial || this.exec('get-serialno'),
    };
  }

  async install(apkPath) {
    this.exec(`install -r "${apkPath}"`);
    return true;
  }

  async launch(packageName) {
    await this.shell(`monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`);
    return true;
  }

  async screencap(outputPath = '/sdcard/screencap.png') {
    this.exec(`shell screencap ${outputPath}`);
    return this.exec(`pull ${outputPath}`);
  }

  async getText(selector) {
    // Requires UI Automator (Android 4.4+)
    const output = await this.shell('uiautomator dump /dev/null');
    // Parse XML for text with selector
    return output;
  }

  async tap(x, y) {
    return this.shell(`input tap ${x} ${y}`);
  }

  async swipe(x1, y1, x2, y2, duration = 300) {
    return this.shell(`input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
  }

  async type(text) {
    return this.shell(`input text "${text}"`);
  }

  async pushFile(localPath, remotePath) {
    this.exec(`push "${localPath}" "${remotePath}"`);
    return true;
  }

  async pullFile(remotePath, localPath) {
    this.exec(`pull "${remotePath}" "${localPath}"`);
    return true;
  }
}

module.exports = ADBControl;
