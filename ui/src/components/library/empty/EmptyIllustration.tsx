import React from 'react'
import { Box, Square, Circle } from '@chakra-ui/react'
import { Library, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export function EmptyIllustration() {
  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      {/* Background Radial Halo */}
      <Box
        position="absolute"
        w="emptyHaloSize"
        h="emptyHaloSize"
        borderRadius="full"
        bg="{colors.gradient.emptyHalo}"
        filter="blur(2rem)"
        pointerEvents="none"
        aria-hidden="true"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Main Card Icon */}
        <Square
          size="emptyIconSize"
          layerStyle="emptyIconBox"
        >
          <Library size={52} strokeWidth={1.4} />
        </Square>

        {/* Floating Sparkle Badge */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
          }}
        >
          <Circle
            size="iconBadge"
            layerStyle="emptySparkleBadge"
          >
            <Sparkles size={16} />
          </Circle>
        </motion.div>
      </motion.div>
    </Box>
  )
}
