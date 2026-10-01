import { defineTokens } from '@chakra-ui/react'
import { colorTokens } from './colors'
import {
  fontTokens,
  fontSizeTokens,
  fontWeightTokens,
  lineHeightTokens,
  letterSpacingTokens,
} from './typography'
import { radiiTokens } from './radii'
import { shadowTokens } from './shadows'
import { blurTokens } from './blurs'
import { sizeTokens, spacingTokens } from './spacing'

export const tokens = defineTokens({
  colors: colorTokens,
  fonts: fontTokens,
  fontSizes: fontSizeTokens,
  fontWeights: fontWeightTokens,
  lineHeights: lineHeightTokens,
  letterSpacings: letterSpacingTokens,
  radii: radiiTokens,
  shadows: shadowTokens,
  blurs: blurTokens,
  sizes: sizeTokens,
  spacing: spacingTokens,
})

export * from './colors'
export * from './typography'
export * from './radii'
export * from './shadows'
export * from './blurs'
export * from './spacing'
