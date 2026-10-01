import React from 'react'
import { Box } from '@chakra-ui/react'
import { motion } from 'motion/react'
import { rubyDarkA, purpleDarkA } from '@radix-ui/colors'

export function AmbientAura() {
  const rubyGradient = `radial-gradient(circle, ${rubyDarkA.rubyA5} 0%, ${rubyDarkA.rubyA2} 45%, transparent 70%)`
  const purpleGradient = `radial-gradient(circle, ${purpleDarkA.purpleA5} 0%, ${purpleDarkA.purpleA2} 50%, transparent 70%)`
  const rubyAccentGradient = `radial-gradient(ellipse 60% 50% at 50% 50%, ${rubyDarkA.rubyA3} 0%, transparent 70%)`

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
      aria-hidden="true"
    >
      {/* Primary Ruby Glow - Top Left */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.45, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-10rem',
          left: '-10rem',
          width: '38rem',
          height: '38rem',
          borderRadius: '9999rem',
          background: rubyGradient,
          filter: 'blur(4rem)',
        }}
      />

      {/* Secondary Violet / Indigo Glow - Top Right */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        style={{
          position: 'absolute',
          top: '-6rem',
          right: '-8rem',
          width: '34rem',
          height: '34rem',
          borderRadius: '9999rem',
          background: purpleGradient,
          filter: 'blur(4.5rem)',
        }}
      />

      {/* Bottom Subtle Ruby Accent */}
      <motion.div
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
          delay: 3,
        }}
        style={{
          position: 'absolute',
          bottom: '-12rem',
          left: '25%',
          width: '45rem',
          height: '30rem',
          borderRadius: '9999rem',
          background: rubyAccentGradient,
          filter: 'blur(5rem)',
        }}
      />
    </Box>
  )
}
