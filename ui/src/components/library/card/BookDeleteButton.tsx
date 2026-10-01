import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { motion } from 'motion/react'

export interface BookDeleteButtonProps {
  ariaLabel: string
  onDelete: (event: React.MouseEvent) => void
}

export function BookDeleteButton({ ariaLabel, onDelete }: BookDeleteButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 12 }}
    >
      <IconButton
        aria-label={ariaLabel}
        title={ariaLabel}
        size="xs"
        colorPalette="ruby"
        variant="subtle"
        onClick={onDelete}
      >
        <Trash2 size="0.875rem" />
      </IconButton>
    </motion.div>
  )
}
