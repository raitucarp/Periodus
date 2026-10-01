import { defineTextStyles } from '@chakra-ui/react'

export const textStyles = defineTextStyles({
  'brand.title': {
    value: {
      fontFamily: 'heading',
      fontSize: '2xl',
      fontWeight: 'bold',
      letterSpacing: 'wider',
      textTransform: 'uppercase',
    },
  },
  'brand.emptyTitle': {
    value: {
      fontFamily: 'heading',
      fontSize: '5xl',
      fontWeight: 'bold',
      letterSpacing: 'tight',
    },
  },
  'reading.h1': {
    value: {
      fontFamily: 'heading',
      fontSize: '5xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      color: 'fg',
    },
  },
  'reading.h2': {
    value: {
      fontFamily: 'heading',
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'snug',
      color: 'fg',
    },
  },
  'reading.h3': {
    value: {
      fontFamily: 'heading',
      fontSize: '3xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      color: 'fg',
    },
  },
  'reading.h4': {
    value: {
      fontFamily: 'heading',
      fontSize: 'xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      color: 'fg',
    },
  },
  'reading.body': {
    value: {
      fontFamily: 'reading',
      fontSize: '2xl',
      lineHeight: 'reading',
      letterSpacing: 'wide',
      color: 'fg',
    },
  },
  'reading.quote': {
    value: {
      fontFamily: 'editorial',
      fontSize: 'xl',
      lineHeight: 'editorial',
      fontStyle: 'italic',
      color: 'fg.muted',
    },
  },
  'reading.code': {
    value: {
      fontFamily: 'mono',
      fontSize: '0.9em',
    },
  },
  'analysis.header': {
    value: {
      fontFamily: 'heading',
      fontSize: 'sm',
      fontWeight: 'semibold',
      letterSpacing: 'wide',
      color: 'fg',
    },
  },
  'analysis.body': {
    value: {
      fontFamily: 'analysis',
      fontSize: 'sm',
      lineHeight: 'loose',
      color: 'fg',
    },
  },
  'analysis.badge': {
    value: {
      fontFamily: 'ui',
      fontSize: '2xs',
      fontWeight: 'bold',
      letterSpacing: 'wider',
      textTransform: 'uppercase',
    },
  },
  'analysis.errorHeading': {
    value: {
      fontFamily: 'ui',
      fontSize: 'sm',
      fontWeight: 'bold',
    },
  },
  'analysis.errorMessage': {
    value: {
      fontFamily: 'ui',
      fontSize: 'xs',
      lineHeight: 'tall',
    },
  },
  'shelf.title': {
    value: {
      fontFamily: 'heading',
      fontSize: 'md',
      fontWeight: 'bold',
      color: 'fg',
    },
  },
  'shelf.empty': {
    value: {
      fontFamily: 'ui',
      fontSize: 'sm',
      color: 'fg.muted',
    },
  },
  'card.title': {
    value: {
      fontFamily: 'heading',
      fontSize: 'xs',
      fontWeight: 'semibold',
    },
  },
  'card.author': {
    value: {
      fontFamily: 'ui',
      fontSize: 'xs',
      color: 'fg.muted',
    },
  },
  'modal.title': {
    value: {
      fontFamily: 'heading',
      fontSize: 'lg',
      fontWeight: 'bold',
      color: 'fg',
    },
  },
  'modal.description': {
    value: {
      fontFamily: 'ui',
      fontSize: 'sm',
      lineHeight: 'tall',
      color: 'fg.muted',
    },
  },
  'modal.fieldLabel': {
    value: {
      fontFamily: 'ui',
      fontSize: 'xs',
      fontWeight: 'bold',
      color: 'fg.muted',
    },
  },
})
