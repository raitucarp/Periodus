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
        px="2.25rem"
        py="1.625rem"
        fontWeight="bold"
        letterSpacing="0.02em"
        bg="linear-gradient(135deg, #e5484d 0%, #c42b33 100%)"
        color="#ffffff"
        borderWidth="0.0625rem"
        borderStyle="solid"
        borderColor="whiteA.5"
        boxShadow="0 0.5rem 1.75rem -0.25rem {colors.rubyA.9}, inset 0 0.0625rem 0.0625rem {colors.whiteA.6}"
        _hover={{
          bg: 'linear-gradient(135deg, #f0565b 0%, #d63940 100%)',
          boxShadow: '0 0.75rem 2.25rem {colors.rubyA.11}, inset 0 0.0625rem 0.0625rem {colors.whiteA.7}',
        }}
        _active={{
          bg: 'linear-gradient(135deg, #cc383e 0%, #b8242b 100%)',
        }}
        loading={isImporting}
        loadingText={label}
        onClick={onClick}
        transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <BookPlus size="1.25rem" strokeWidth={2} />
        {label}
      </Button>
    </motion.div>
  )
}
