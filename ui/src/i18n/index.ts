import { atom, useAtom } from 'jotai'
import { en } from './en'
import { id } from './id'
import { fr } from './fr'
import { de } from './de'
import { la } from './la'
import { nl } from './nl'
import { es } from './es'
import { ja } from './ja'
import type { Locale, TranslationSchema } from './types'

const translations: Record<Locale, TranslationSchema> = {
  en,
  id,
  fr,
  de,
  la,
  nl,
  es,
  ja,
}

function getInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'en'
  const saved = localStorage.getItem('periodus_locale')
  if (saved && saved in translations) {
    return saved as Locale
  }
  return 'en'
}

export const localeAtom = atom<Locale>(getInitialLocale())

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useAtom(localeAtom)

  function changeLocale(newLocale: Locale) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('periodus_locale', newLocale)
    }
    setCurrentLocale(newLocale)
  }

  const t = translations[currentLocale] || translations.en

  function format(template: string, params: Record<string, string | number>): string {
    let result = template
    for (const key of Object.keys(params)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]))
    }
    return result
  }

  return {
    locale: currentLocale,
    changeLocale,
    t,
    format,
  }
}

export * from './types'
