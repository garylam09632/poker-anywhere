export const i18n = {
  defaultLocale: 'en-US',
  locales: [
    'en-US', 'zh-TW', 'zh-CN', 'zh-HK', 'ja-JP', 'ko-KR', 'de-DE', 'pt-BR', 
    'hi-IN', 'ru-RU', 'fr-FR', 'it-IT', 'fil-PH', 'es-AR', "th-TH", "vi-VN"
  ],
} as const;

export type Locale = (typeof i18n)["locales"][number];
