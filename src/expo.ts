import * as Application from "expo-application";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Storage } from "@formizeflow/react-native";
import type { ExpoInfo } from "./attributes";

const DEVICE_TYPES: Record<number, string> = { 1: "phone", 2: "tablet", 3: "desktop", 4: "tv" };

/** Reads the install's details from expo-application, expo-constants, expo-device and expo-localization. All of them ship in Expo Go. */
export function readExpoInfo(): ExpoInfo {
  const loc = (() => { try { return Localization.getLocales()[0]; } catch { return undefined; } })();
  // in Expo Go the native app is Expo Go itself, so the app's own version and id come from app.json
  const cfg = Constants.executionEnvironment === ExecutionEnvironment.StoreClient ? Constants.expoConfig : null;
  const build = cfg ? (Platform.OS === "ios" ? cfg.ios?.buildNumber : cfg.android?.versionCode?.toString()) : Application.nativeBuildVersion;
  const id = cfg ? (Platform.OS === "ios" ? cfg.ios?.bundleIdentifier : cfg.android?.package) : Application.applicationId;
  return {
    appVersion: cfg ? cfg.version : Application.nativeApplicationVersion,
    buildVersion: build,
    appId: id,
    deviceModel: Device.modelName,
    deviceType: Device.deviceType != null ? DEVICE_TYPES[Device.deviceType] : undefined,
    osName: Device.osName,
    osVersion: Device.osVersion,
    locale: loc?.languageTag,
    region: loc?.regionCode,
  };
}

/** AsyncStorage as the decision cache, so an offline launch reuses the last decision. */
export const defaultStorage: Storage = AsyncStorage;
