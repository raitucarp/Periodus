import React from 'react'
import { Button } from '@chakra-ui/react'
import { BookPlus } from 'lucide-react'
import { motion } from 'motion/react'

export interface EmptyActionButtonProps {
  isImporting: boolean
  label: string
  onClick: () => void
}

export function EmptyActionButton({ isImporting, label, onClick }: EmptyActionButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        size="lg"
        px="9"
        py="6.5"
        fontWeight="bold"
        letterSpacing="wide"
        layerStyle="brandButtonPrimary"
        loading={isImporting}
        loadingText={label}
        onClick={onClick}
      >
        <BookPlus size={20} strokeWidth={2} />
        {label}
      </Button>
    </motion.div>
  )
}
