import type { Scalar } from "@formizeflow/react-native";

/** What the Expo modules report about this install. Every field may be missing (web, simulators, older SDKs). */
export type ExpoInfo = { appVersion?: string | null; buildVersion?: string | null; appId?: string | null; deviceModel?: string | null; deviceType?: string | null; osName?: string | null; osVersion?: string | null; locale?: string | null; region?: string | null };

/** Attributes for targeting, from Expo's info; yours override them. Empty values are left out. */
export function attributesFrom(info: ExpoInfo, own: Record<string, Scalar> = {}): Record<string, Scalar> {
  const pairs: [string, string | null | undefined][] = [
    ["app_version", info.appVersion], ["app_build", info.buildVersion], ["app_id", info.appId], ["device_model", info.deviceModel],
    ["device_type", info.deviceType], ["platform", info.osName?.toLowerCase()], ["os_version", info.osVersion], ["locale", info.locale], ["country", info.region],
  ];
  const auto: Record<string, Scalar> = {};
  for (const [k, v] of pairs) if (v) auto[k] = v;
  return { ...auto, ...own };
}
