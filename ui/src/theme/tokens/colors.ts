import {
  slate,
  slateDark,
  slateA,
  slateDarkA,
  ruby,
  rubyDark,
  rubyA,
  rubyDarkA,
  blackA,
  whiteA,
  red,
  redDark,
  redA,
  redDarkA,
  purple,
  purpleDark,
  purpleA,
  purpleDarkA,
} from '@radix-ui/colors'

export function formatScale(scaleObj: Record<string, string>) {
  const result: Record<string, { value: string }> = {}
  for (const [key, value] of Object.entries(scaleObj)) {
    const step = key.replace(/^[a-zA-Z]+/, '')
    result[step] = { value }
  }
  return result
}

export function formatNumericScale(scaleObj: Record<string, string>, prefix: string) {
  const base = formatScale(scaleObj)
  const numericSteps: Record<string, string> = {
    '50': `${prefix}1`,
    '100': `${prefix}2`,
    '200': `${prefix}3`,
    '300': `${prefix}4`,
    '400': `${prefix}5`,
    '500': `${prefix}6`,
    '600': `${prefix}7`,
    '700': `${prefix}8`,
    '800': `${prefix}9`,
    '900': `${prefix}10`,
    '950': `${prefix}11`,
  }
  for (const [step, key] of Object.entries(numericSteps)) {
    if (scaleObj[key]) {
      base[step] = { value: scaleObj[key] }
    }
  }
  return base
}

export const colorTokens = {
  slate: formatNumericScale(slate, 'slate'),
  slateDark: formatNumericScale(slateDark, 'slateDark'),
  slateA: formatScale(slateA),
  slateDarkA: formatScale(slateDarkA),
  ruby: formatNumericScale(ruby, 'ruby'),
  rubyDark: formatNumericScale(rubyDark, 'rubyDark'),
  rubyA: formatScale(rubyA),
  rubyDarkA: formatScale(rubyDarkA),
  blackA: formatScale(blackA),
  whiteA: formatScale(whiteA),
  red: formatNumericScale(red, 'red'),
  redDark: formatNumericScale(redDark, 'redDark'),
  redA: formatScale(redA),
  redDarkA: formatScale(redDarkA),
  purple: formatNumericScale(purple, 'purple'),
  purpleDark: formatNumericScale(purpleDark, 'purpleDark'),
  purpleA: formatScale(purpleA),
  purpleDarkA: formatScale(purpleDarkA),
}
