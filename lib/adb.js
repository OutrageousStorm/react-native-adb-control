/**
 * adb.js - Node.js ADB wrapper for React Native projects
 * Usage:
 *   const adb = require('./lib/adb');
 *   await adb.shell('pm list packages');
 *   await adb.installApk('./app.apk');
 *   await adb.tapScreen(540, 960);
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class ADB {
  constructor() {
    this.adbCmd = 'adb';
    this.checkAdb();
  }

  checkAdb() {
    try {
      execSync('adb version', { stdio: 'ignore' });
    } catch (e) {
      throw new Error('adb not found in PATH. Install Android SDK or add to PATH.');
    }
  }

  async shell(cmd) {
    return new Promise((resolve, reject) => {
      try {
        const result = execSync(`adb shell ${cmd}`, { encoding: 'utf-8' });
        resolve(result.trim());
      } catch (e) {
        reject(e.message);
      }
    });
  }

  async devices() {
    try {
      const result = execSync('adb devices', { encoding: 'utf-8' });
      const lines = result.split('\n').slice(1).filter(l => l.trim() && l.includes('device'));
      return lines.map(l => l.split('\t')[0]);
    } catch (e) {
      return [];
    }
  }

  async installApk(apkPath) {
    if (!fs.existsSync(apkPath)) throw new Error(`APK not found: ${apkPath}`);
    try {
      execSync(`adb install -r "${apkPath}"`, { stdio: 'inherit' });
      return true;
    } catch (e) {
      throw new Error(`Failed to install APK: ${e.message}`);
    }
  }

  async uninstall(pkgName) {
    await this.shell(`pm uninstall -k --user 0 ${pkgName}`);
    return true;
  }

  async tapScreen(x, y) {
    await this.shell(`input tap ${x} ${y}`);
  }

  async swipe(x1, y1, x2, y2, duration = 300) {
    await this.shell(`input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
  }

  async typeText(text) {
    const escaped = text.replace(/"/g, '\\"');
    await this.shell(`input text "${escaped}"`);
  }

  async pressKey(code) {
    await this.shell(`input keyevent ${code}`);
  }

  async takeScreenshot(outputPath = './screenshot.png') {
    const tmpPath = '/sdcard/screenshot_tmp.png';
    await this.shell(`screencap -p ${tmpPath}`);
    execSync(`adb pull ${tmpPath} ${outputPath}`);
    await this.shell(`rm ${tmpPath}`);
    return outputPath;
  }

  async startApp(pkgName) {
    await this.shell(`monkey -p ${pkgName} -c android.intent.category.LAUNCHER 1`);
  }

  async stopApp(pkgName) {
    await this.shell(`am force-stop ${pkgName}`);
  }

  async getPropertyValue(prop) {
    return await this.shell(`getprop ${prop}`);
  }

  async setProperty(prop, value) {
    await this.shell(`setprop ${prop} ${value}`);
  }
}

module.exports = new ADB();
