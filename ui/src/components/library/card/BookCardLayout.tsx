import React from 'react'
import { Card, Box } from '@chakra-ui/react'
import { motion } from 'motion/react'

export interface BookCardLayoutProps {
  isHovered: boolean
  borderColor: string
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  children: React.ReactNode
  caption: React.ReactNode
}

export function BookCardLayout({
  isHovered,
  borderColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  caption,
}: BookCardLayoutProps) {
  return (
    <Box
      asChild
      w="bookCardWidth"
      flexShrink={0}
      cursor="pointer"
      position="relative"
      zIndex={isHovered ? 'docked' : 'base'}
    >
      <motion.div
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={{ scale: 1.05, y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <Card.Root
          w="bookCardWidth"
          h="bookCardHeight"
          rounded="xl"
          overflow="hidden"
          layerStyle="cardInteractive"
          borderColor={borderColor}
          position="relative"
        >
          {children}
        </Card.Root>
        {caption}
      </motion.div>
    </Box>
  )
}
