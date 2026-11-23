import { describe, expect, it } from "vitest";
import { attributesFrom } from "./attributes";

describe("expo attributes", () => {
  it("maps Expo's info to attribute keys and drops empty values", () => {
    expect(attributesFrom({ appVersion: "1.4.0", buildVersion: "42", appId: "com.acme.app", deviceModel: "iPhone 15", deviceType: "phone", osName: "iOS", osVersion: "18.1", locale: "en-GB", region: "GB" })).toEqual({
      app_version: "1.4.0", app_build: "42", app_id: "com.acme.app", device_model: "iPhone 15", device_type: "phone", platform: "ios", os_version: "18.1", locale: "en-GB", country: "GB",
    });
    expect(attributesFrom({ appVersion: null, deviceModel: "", osName: "Android" })).toEqual({ platform: "android" });
  });
  it("lets your attributes win", () => {
    expect(attributesFrom({ appVersion: "1.0.0", locale: "en" }, { locale: "fr", plan: "pro" })).toEqual({ app_version: "1.0.0", locale: "fr", plan: "pro" });
  });
});
