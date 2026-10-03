export interface RadixColorOption {
  name: string
  label: string
  hex: string
}

export const RADIX_COLORS_ROW_1: RadixColorOption[] = [
  { name: 'tomato', label: 'Tomato', hex: '#e54d2e' },
  { name: 'red', label: 'Red', hex: '#e5484d' },
  { name: 'ruby', label: 'Ruby', hex: '#e54666' },
  { name: 'crimson', label: 'Crimson', hex: '#e93d82' },
  { name: 'pink', label: 'Pink', hex: '#d6409f' },
  { name: 'plum', label: 'Plum', hex: '#ab4aba' },
  { name: 'purple', label: 'Purple', hex: '#8e4ec6' },
  { name: 'violet', label: 'Violet', hex: '#6e56cf' },
  { name: 'iris', label: 'Iris', hex: '#5b5bd6' },
  { name: 'indigo', label: 'Indigo', hex: '#3e63dd' },
  { name: 'blue', label: 'Blue', hex: '#0090ff' },
  { name: 'cyan', label: 'Cyan', hex: '#00a2c7' },
  { name: 'teal', label: 'Teal', hex: '#12a594' },
]

export const RADIX_COLORS_ROW_2: RadixColorOption[] = [
  { name: 'jade', label: 'Jade', hex: '#29a383' },
  { name: 'green', label: 'Green', hex: '#30a46c' },
  { name: 'grass', label: 'Grass', hex: '#46a758' },
  { name: 'lime', label: 'Lime', hex: '#99d52a' },
  { name: 'mint', label: 'Mint', hex: '#86ead4' },
  { name: 'sky', label: 'Sky', hex: '#7ce2fe' },
  { name: 'yellow', label: 'Yellow', hex: '#ffe629' },
  { name: 'amber', label: 'Amber', hex: '#ffc53d' },
  { name: 'orange', label: 'Orange', hex: '#f76808' },
  { name: 'brown', label: 'Brown', hex: '#ad7f58' },
  { name: 'bronze', label: 'Bronze', hex: '#a18072' },
  { name: 'gold', label: 'Gold', hex: '#978365' },
  { name: 'gray', label: 'Gray', hex: '#8b8d98' },
]

export const ALL_RADIX_COLORS = [...RADIX_COLORS_ROW_1, ...RADIX_COLORS_ROW_2]

export const RADIX_HEX_MAP: Record<string, string> = Object.fromEntries(
  ALL_RADIX_COLORS.map((c) => [c.name, c.hex])
)

import * as RadixAllColors from '@radix-ui/colors'

export function getRadixScale(colorName: string, isDark: boolean): Record<string, string> {
  const all = RadixAllColors as Record<string, Record<string, string>>
  const key = isDark ? `${colorName}Dark` : colorName
  return all[key] || all[colorName] || (isDark ? all.blueDark : all.blue)
}

export function getRadixStep(colorName: string, step: number, isDark: boolean): string {
  const scale = getRadixScale(colorName, isDark)
  return scale[`${colorName}${step}`] || scale[`blue${step}`] || '#0090ff'
}

