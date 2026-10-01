import { atom, useAtom } from 'jotai'
import { id } from './id'
import { en } from './en'
import type { Locale, TranslationSchema } from './types'

const translations: Record<Locale, TranslationSchema> = {
  id,
  en,
}

const savedLocale = (typeof localStorage !== 'undefined' && localStorage.getItem('periodus_locale')) as Locale | null
export const localeAtom = atom<Locale>(savedLocale === 'id' ? 'id' : 'en')

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useAtom(localeAtom)

  function changeLocale(newLocale: Locale) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('periodus_locale', newLocale)
    }
    setCurrentLocale(newLocale)
  }

  const t = translations[currentLocale]

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
