import "server-only";
import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  "en-US": () => import("./dictionaries/en-US.json").then((module) => module.default),
  "zh-TW": () => import("./dictionaries/zh-TW.json").then((module) => module.default),
  "zh-CN": () => import("./dictionaries/zh-CN.json").then((module) => module.default),
  "zh-HK": () => import("./dictionaries/zh-HK.json").then((module) => module.default),
  "ja-JP": () => import("./dictionaries/ja-JP.json").then((module) => module.default),
  "ko-KR": () => import("./dictionaries/ko-KR.json").then((module) => module.default),
  "de-DE": () => import("./dictionaries/de-DE.json").then((module) => module.default),
  "pt-BR": () => import("./dictionaries/pt-BR.json").then((module) => module.default),
  "hi-IN": () => import("./dictionaries/hi-IN.json").then((module) => module.default),
  "ru-RU": () => import("./dictionaries/ru-RU.json").then((module) => module.default),
  "fr-FR": () => import("./dictionaries/fr-FR.json").then((module) => module.default),
  "it-IT": () => import("./dictionaries/it-IT.json").then((module) => module.default),
  "fil-PH": () => import("./dictionaries/fil-PH.json").then((module) => module.default),
  "es-AR": () => import("./dictionaries/es-AR.json").then((module) => module.default),
  "th-TH": () => import("./dictionaries/th-TH.json").then((module) => module.default),
  "vi-VN": () => import("./dictionaries/vi-VN.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries["en-US"]();
