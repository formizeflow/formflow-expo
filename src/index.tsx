import React, { useMemo } from "react";
import {
  FormFlowForm as RNForm, FormFlowView as RNView, useFormFlowOnboarding as rnOnboarding,
  type DecideOptions, type FormFlowFormProps as RNFormProps, type FormFlowViewProps as RNViewProps, type Storage,
} from "@formizeflow/react-native";
import { attributesFrom } from "./attributes";
import { defaultStorage, readExpoInfo } from "./expo";

export * from "@formizeflow/react-native";
export { attributesFrom, type ExpoInfo } from "./attributes";
export { readExpoInfo, defaultStorage } from "./expo";
export const expoVersion = "0.1.0";

const DEFAULT_BASE = "https://formize.net";
type WithBase<T extends { baseUrl: string }> = Omit<T, "baseUrl"> & { baseUrl?: string };

/** Your attributes on top of what Expo reports (app version and build, device model and type, OS, locale, country), unless autoAttributes is false. */
export function expoAttributes(own?: Record<string, string | number | boolean>, auto = true) {
  if (!auto) return own ?? {};
  try { return attributesFrom(readExpoInfo(), own); } catch { return own ?? {}; }
}

function useExpoAttrs(p: { attributes?: Record<string, string | number | boolean>; autoAttributes?: boolean }) {
  const key = JSON.stringify(p.attributes ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => expoAttributes(p.attributes, p.autoAttributes !== false), [key, p.autoAttributes]);
}

export type FormFlowFormProps = WithBase<RNFormProps>;
export type FormFlowViewProps = WithBase<RNViewProps>;

/** The React Native <FormFlowForm>, with formize.net as the default host and Expo's device and app details as attributes. */
export function FormFlowForm(props: FormFlowFormProps) {
  const attributes = useExpoAttrs(props);
  return <RNForm {...props} baseUrl={props.baseUrl ?? DEFAULT_BASE} attributes={attributes} />;
}

/** The React Native <FormFlowView entry onDone onRoute/>, with the same Expo defaults. */
export function FormFlowView(props: FormFlowViewProps) {
  const attributes = useExpoAttrs(props);
  return <RNView {...props} baseUrl={props.baseUrl ?? DEFAULT_BASE} attributes={attributes} />;
}

/** useFormFlowOnboarding with AsyncStorage as the offline cache, formize.net as the default host and Expo's attributes. */
export function useFormFlowOnboarding(o: DecideOptions & { baseUrl?: string; storage?: Storage; timeoutMs?: number; autoAttributes?: boolean }) {
  const attributes = useExpoAttrs(o);
  return rnOnboarding({ ...o, baseUrl: o.baseUrl ?? DEFAULT_BASE, storage: o.storage ?? defaultStorage, attributes });
}
