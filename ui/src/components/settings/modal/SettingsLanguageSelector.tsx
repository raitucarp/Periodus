import React from 'react'
import { NativeSelect, VStack, Text } from '@chakra-ui/react'
import { type Locale, SUPPORTED_LOCALES } from '@/i18n'

export interface SettingsLanguageSelectorProps {
  label: string
  currentLocale: Locale
  onSelect: (locale: Locale) => void
}

export function SettingsLanguageSelector({ label, currentLocale, onSelect }: SettingsLanguageSelectorProps) {
  return (
    <VStack align="stretch" gap="2" mb="5">
      <Text textStyle="modal.fieldLabel">
        {label}
      </Text>
      <NativeSelect.Root size="sm" width="full">
        <NativeSelect.Field
          value={currentLocale}
          onChange={(e) => onSelect(e.currentTarget.value as Locale)}
          bg="glass.input"
          borderColor="glass.borderSubtle"
          rounded="lg"
          _focus={{ borderColor: 'ruby.solid' }}
        >
          {SUPPORTED_LOCALES.map(({ code, nativeName, label: langLabel }) => (
            <option
              key={code}
              value={code}
              style={{
                backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                color: 'inherit',
              }}
            >
              {nativeName} - {langLabel}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </VStack>
  )
}
