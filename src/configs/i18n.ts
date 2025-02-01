export const i18n = {
  defaultLocale: 'fi',
  locales: ['en', 'fi'],
  langDirection: {
    en: 'ltr',
    fi: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
