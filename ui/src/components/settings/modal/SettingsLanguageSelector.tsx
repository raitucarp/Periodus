import React from 'react'
import { HStack, VStack, Text, Button } from '@chakra-ui/react'
import { Globe } from 'lucide-react'
import type { Locale } from '@/i18n'

export interface SettingsLanguageSelectorProps {
  label: string
  currentLocale: Locale
  onSelect: (locale: Locale) => void
}

export function SettingsLanguageSelector({ label, currentLocale, onSelect }: SettingsLanguageSelectorProps) {
  const isId = currentLocale === 'id'
  const isEn = currentLocale === 'en'

  function handleChooseId() {
    onSelect('id')
  }

  function handleChooseEn() {
    onSelect('en')
  }

  return (
    <VStack align="stretch" gap="0.5rem" mb="1.25rem">
      <Text textStyle="xs" fontWeight="bold" color="fg.muted">
        {label}
      </Text>
      <HStack gap="0.75rem">
        <Button
          size="sm"
          colorPalette="ruby"
          variant={isId ? 'solid' : 'outline'}
          onClick={handleChooseId}
          flex="1"
        >
          <Globe size="0.875rem" />
          Bahasa Indonesia (ID)
        </Button>
        <Button
          size="sm"
          colorPalette="ruby"
          variant={isEn ? 'solid' : 'outline'}
          onClick={handleChooseEn}
          flex="1"
        >
          <Globe size="0.875rem" />
          English (EN)
        </Button>
      </HStack>
    </VStack>
  )
}
