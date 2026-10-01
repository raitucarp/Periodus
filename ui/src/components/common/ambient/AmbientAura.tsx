import React from 'react'
import { Box } from '@chakra-ui/react'
import { motion } from 'motion/react'

export function AmbientAura() {
  return (
    <Box
      position="fixed"
      inset="0"
      overflow="hidden"
      pointerEvents="none"
      zIndex="0"
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
        }}
      >
        <Box
          layerStyle="ambientAuraRuby"
          w="auraRuby"
          h="auraRuby"
        />
      </motion.div>

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
        }}
      >
        <Box
          layerStyle="ambientAuraPurple"
          w="auraPurple"
          h="auraPurple"
        />
      </motion.div>

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
        }}
      >
        <Box
          layerStyle="ambientAuraAccent"
          w="auraAccentWidth"
          h="auraAccentHeight"
        />
      </motion.div>
    </Box>
  )
}
