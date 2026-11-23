# @formizeflow/expo

[![CI](https://github.com/formizeflow/formflow-expo/actions/workflows/ci.yml/badge.svg)](https://github.com/formizeflow/formflow-expo/actions/workflows/ci.yml)

FormFlow forms in Expo apps: onboarding, surveys, feedback and onboarding A/B tests. Works in **Expo Go** with no config plugin and no prebuild, and in development and production builds.

It is [`@formizeflow/react-native`](https://github.com/formizeflow/formflow-react-native) with Expo defaults:

- `https://formize.net` as the host, so `baseUrl` is optional.
- App version, build, app id, device model and type, OS, locale and country sent as attributes for targeting. In Expo Go the app's own version and id come from `app.json`, not Expo Go's.
- AsyncStorage as the offline cache for onboarding decisions.

Everything else in the React Native SDK is re-exported unchanged.

## Install

```
npx expo install @formizeflow/expo react-native-webview expo-application expo-constants expo-device expo-localization @react-native-async-storage/async-storage
```

`npx expo install` picks the versions that match your Expo SDK. All of these modules ship in Expo Go.

## Onboarding

```tsx
import { FormFlowView, useFormFlowOnboarding } from "@formizeflow/expo";

export function Onboarding({ userId, onDone }: { userId: string; onDone: () => void }) {
  const { status, props } = useFormFlowOnboarding({ entry: "app-welcome", uid: userId, firstRunOnly: true });
  if (status === "loading") return null;
  if (status === "skip" || !props) { onDone(); return null; }
  return <FormFlowView entry={props.slug} variant={props.variant} uid={userId} onDone={onDone} onRoute={(route) => router.push(`/${route}`)} />;
}
```

`status` is `skip` for the holdout group, for people who already finished, and when offline with no cached decision. A failure never blocks your app.

## A single form

```tsx
import { FormFlowForm } from "@formizeflow/expo";

<FormFlowForm slug="feedback" uid={userId} onComplete={() => router.back()} style={{ flex: 1 }} />
```

## Attributes

Sent as `attrs.<key>`: `app_version`, `app_build`, `app_id`, `device_model`, `device_type` (phone, tablet, desktop, tv), `platform`, `os_version`, `locale`, `country`. Values you pass in `attributes` win. Set `autoAttributes={false}` to send only yours. `expoAttributes()` returns the same map for your own calls.

## Signed uids

A uid in a URL can be forged. When a test or form relies on who the person is, have **your server** sign the uid with the workspace identity secret and pass `uidSignature`. Never sign inside the app.

## Expo Router

Endings with a `ctaRoute`, or a custom-scheme address such as `myapp://tools/scan`, arrive in `onRoute` as `tools/scan`. Push it with `router.push`. Web addresses open in the system browser.
