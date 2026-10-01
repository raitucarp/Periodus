import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { tokens } from './tokens'
import { semanticTokens } from './semantic-tokens'
import { textStyles } from './text-styles'
import { layerStyles } from './layer-styles'

const config = defineConfig({
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'bg',
      color: 'fg',
      fontFamily: 'body',
      lineHeight: '1.5',
      textRendering: 'optimizeLegibility',
    },
    '#root': {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    '*': {
      boxSizing: 'border-box',
    },
    '::selection': {
      backgroundColor: 'ruby.subtle',
      color: 'ruby.fg',
    },
    '::-webkit-scrollbar': {
      width: '0.375rem',
      height: '0.375rem',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: 'border.subtle',
      borderRadius: 'full',
    },
    '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'border.default',
    },
  },
  theme: {
    tokens,
    semanticTokens,
    textStyles,
    layerStyles,
  },
})

export const system = createSystem(defaultConfig, config)

export * from './tokens'
export * from './semantic-tokens'
export * from './text-styles'
export * from './layer-styles'
