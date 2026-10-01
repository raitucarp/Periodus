import { defineSemanticTokens } from '@chakra-ui/react'
import { semanticColorTokens } from './colors'
import { semanticShadowTokens } from './shadows'

export const semanticTokens = defineSemanticTokens({
  colors: semanticColorTokens,
  shadows: semanticShadowTokens,
})

export * from './colors'
export * from './shadows'
