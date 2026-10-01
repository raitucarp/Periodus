import React from 'react'
import { Button, Text } from '@chakra-ui/react'
import { Globe } from 'lucide-react'
import type { Locale } from '@/i18n'

export interface LanguageButtonProps {
  locale: Locale
  label: string
  onToggle: () => void
}

export function LanguageButton({ locale, label, onToggle }: LanguageButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      colorPalette="gray"
      onClick={onToggle}
      title={label}
    >
      <Globe size="0.875rem" />
      <Text as="span" textTransform="uppercase" fontWeight="bold" textStyle="xs">
        {locale}
      </Text>
    </Button>
  )
}
