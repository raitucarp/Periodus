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
        w="15rem"
        h="15rem"
        borderRadius="full"
        bg="radial-gradient(circle, {colors.rubyA.6} 0%, {colors.purpleA.4} 45%, transparent 70%)"
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
          size="6.5rem"
          rounded="3xl"
          bg="linear-gradient(145deg, {colors.slateDark.2} 0%, {colors.slateDark.1} 100%)"
          backdropFilter="blur(1.5rem)"
          borderWidth="0.0625rem"
          borderStyle="solid"
          borderColor="whiteA.3"
          color="ruby.solid"
          boxShadow="inset 0 0.0625rem 0.0625rem 0 {colors.whiteA.4}, 0 1.25rem 2.5rem -0.5rem {colors.blackA.9}, 0 0 2rem {colors.rubyA.5}"
        >
          <Library size="3.25rem" strokeWidth={1.4} />
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
            size="2rem"
            bg="linear-gradient(135deg, #e5484d 0%, #d63940 100%)"
            color="#ffffff"
            borderWidth="0.0625rem"
            borderStyle="solid"
            borderColor="whiteA.5"
            boxShadow="0 0 1.25rem {colors.rubyA.10}, 0 0.25rem 0.5rem {colors.blackA.6}"
          >
            <Sparkles size="0.95rem" />
          </Circle>
        </motion.div>
      </motion.div>
    </Box>
  )
}
