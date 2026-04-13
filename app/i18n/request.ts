import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !hasLocale(routing.locales, locale)) {
    try {
      const r = await rootParams.locale();
      if (hasLocale(routing.locales, r)) locale = r;
    } catch {}
  }
  if (!locale || !hasLocale(routing.locales, locale)) locale = routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
