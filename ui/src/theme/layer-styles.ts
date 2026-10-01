import { defineLayerStyles } from '@chakra-ui/react'

export const layerStyles = defineLayerStyles({
  glassHeader: {
    value: {
      backdropFilter: 'blur(1.5rem)',
      backgroundColor: '{colors.glass.header}',
      borderBottomWidth: '0.0625rem',
      borderBottomColor: '{colors.glass.borderSubtle}',
      boxShadow: '{shadows.glassHeader}',
    },
  },
  glassPanel: {
    value: {
      backdropFilter: 'blur(1.5rem)',
      backgroundColor: '{colors.glass.panel}',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.borderSubtle}',
      borderRadius: '2xl',
      boxShadow: '{shadows.glassPanel}',
    },
  },
  glassModal: {
    value: {
      backdropFilter: 'blur(2rem)',
      backgroundColor: '{colors.glass.modal}',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.border}',
      borderRadius: '3xl',
      boxShadow: '{shadows.glassModal}',
    },
  },
  glassContainer: {
    value: {
      backdropFilter: 'blur(2rem)',
      backgroundColor: '{colors.glass.container}',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.borderSubtle}',
      borderRadius: '2xl',
      boxShadow: '{shadows.glassSplit}',
    },
  },
  glassSidebar: {
    value: {
      backgroundColor: '{colors.glass.sidebar}',
      borderLeftWidth: '0.0625rem',
      borderLeftColor: '{colors.glass.borderSubtle}',
    },
  },
  glassCard: {
    value: {
      backdropFilter: 'blur(1.25rem)',
      backgroundColor: '{colors.glass.card}',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.borderSubtle}',
      borderRadius: 'xl',
      boxShadow: '{shadows.glassCard}',
    },
  },
  cardInteractive: {
    value: {
      backdropFilter: 'blur(1.25rem)',
      backgroundColor: '{colors.glass.card}',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.borderSubtle}',
      borderRadius: 'xl',
      boxShadow: '{shadows.glassCard}',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      _hover: {
        borderColor: 'ruby.solid',
        boxShadow: '{shadows.glassCardHover}',
      },
    },
  },
  ambientGrid: {
    value: {
      backgroundImage: 'radial-gradient({colors.aura.gridDot} 0.0625rem, transparent 0.0625rem)',
      backgroundSize: '1.5rem 1.5rem',
    },
  },
  ambientAuraRuby: {
    value: {
      borderRadius: 'full',
      backgroundImage: '{colors.gradient.ambientAuraRuby}',
      filter: 'blur(4rem)',
    },
  },
  ambientAuraPurple: {
    value: {
      borderRadius: 'full',
      backgroundImage: '{colors.gradient.ambientAuraPurple}',
      filter: 'blur(4.5rem)',
    },
  },
  ambientAuraAccent: {
    value: {
      borderRadius: 'full',
      backgroundImage: '{colors.gradient.ambientAuraAccent}',
      filter: 'blur(5rem)',
    },
  },
  brandLogoSquare: {
    value: {
      borderRadius: 'lg',
      backgroundImage: '{colors.gradient.brandPrimary}',
      color: '#ffffff',
      boxShadow: '{shadows.brandLogo}',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'whiteA.3',
    },
  },
  brandButtonPrimary: {
    value: {
      borderRadius: 'md',
      backgroundImage: '{colors.gradient.brandPrimary}',
      color: '#ffffff',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'whiteA.5',
      boxShadow: '{shadows.glowRubyButton}',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      _hover: {
        backgroundImage: '{colors.gradient.brandPrimaryHover}',
        boxShadow: '{shadows.glowRubyButtonHover}',
      },
      _active: {
        backgroundImage: '{colors.gradient.brandPrimaryActive}',
      },
    },
  },
  brandBadgeSubtle: {
    value: {
      borderRadius: 'full',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'rubyA.5',
      boxShadow: '{shadows.glowRubySm}',
    },
  },
  emptyStateCard: {
    value: {
      borderRadius: '3xl',
      backgroundColor: '{colors.glass.container}',
      backdropFilter: 'blur(2rem)',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: '{colors.glass.borderSubtle}',
      boxShadow: '{shadows.emptyStateCard}',
    },
  },
  emptyIconBox: {
    value: {
      borderRadius: '3xl',
      backgroundImage: '{colors.gradient.emptyIllustrationBg}',
      backdropFilter: 'blur(1.5rem)',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'whiteA.3',
      color: 'ruby.solid',
      boxShadow: '{shadows.emptyIllustrationIcon}',
    },
  },
  emptySparkleBadge: {
    value: {
      borderRadius: 'full',
      backgroundImage: '{colors.gradient.sparkleCircle}',
      color: '#ffffff',
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'whiteA.5',
      boxShadow: '{shadows.sparkleCircle}',
    },
  },
  readingQuoteBox: {
    value: {
      borderLeftWidth: '0.1875rem',
      borderLeftStyle: 'solid',
      borderLeftColor: 'ruby.solid',
      backgroundColor: '{colors.glass.sidebar}',
      borderTopRightRadius: 'lg',
      borderBottomRightRadius: 'lg',
    },
  },
  glassInput: {
    value: {
      borderRadius: 'lg',
      backgroundColor: '{colors.glass.input}',
      backdropFilter: 'blur(1rem)',
      borderWidth: '0.0625rem',
      borderColor: '{colors.glass.borderSubtle}',
      color: 'fg',
      boxShadow: '{shadows.inputInset}',
      _focus: {
        borderColor: 'ruby.solid',
        boxShadow: '{shadows.inputFocus}',
      },
    },
  },
})
