/**
 * @react-native-adb-control/lib
 * TypeScript React Native ADB wrapper
 */
import { NativeModules, NativeEventEmitter } from "react-native";

const ADBModule = NativeModules.ADBControl || {};

export interface DeviceInfo {
  serial: string;
  model: string;
  androidVersion: string;
  cpuAbi: string;
}

export interface AppInfo {
  packageName: string;
  label: string;
  versionCode: number;
  versionName: string;
}

export class ADBClient {
  private eventEmitter: NativeEventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(ADBModule);
  }

  async getDevices(): Promise<string[]> {
    return ADBModule.getDevices?.() || [];
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    return {
      serial: await this.exec("getprop ro.serialno"),
      model: await this.exec("getprop ro.product.model"),
      androidVersion: await this.exec("getprop ro.build.version.release"),
      cpuAbi: await this.exec("getprop ro.product.cpu.abi"),
    };
  }

  async exec(cmd: string): Promise<string> {
    return ADBModule.exec?.(cmd) || "";
  }

  async listPackages(userOnly: boolean = false): Promise<string[]> {
    const flag = userOnly ? "-3" : "";
    const out = await this.exec(`pm list packages ${flag}`);
    return out.split("\n").filter((l) => l.startsWith("package:")).map((l) => l.substring(8));
  }

  async installAPK(apkPath: string, replace: boolean = false): Promise<boolean> {
    const result = await this.exec(`install ${replace ? "-r" : ""} ${apkPath}`);
    return result.includes("Success");
  }

  async uninstall(packageName: string): Promise<boolean> {
    const result = await this.exec(`pm uninstall ${packageName}`);
    return result.includes("Success");
  }

  async launch(packageName: string): Promise<void> {
    await this.exec(`monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`);
  }

  async tap(x: number, y: number): Promise<void> {
    await this.exec(`input tap ${x} ${y}`);
  }

  async swipe(x1: number, y1: number, x2: number, y2: number, duration: number = 300): Promise<void> {
    await this.exec(`input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
  }

  async getScreenSize(): Promise<{ width: number; height: number }> {
    const out = await this.exec("wm size");
    const match = out.match(/(\d+)x(\d+)/);
    return {
      width: match ? parseInt(match[1]) : 1080,
      height: match ? parseInt(match[2]) : 1920,
    };
  }

  onDeviceConnected(callback: (serial: string) => void): void {
    this.eventEmitter.addListener("deviceConnected", callback);
  }

  onDeviceDisconnected(callback: (serial: string) => void): void {
    this.eventEmitter.addListener("deviceDisconnected", callback);
  }
}

export default new ADBClient();
