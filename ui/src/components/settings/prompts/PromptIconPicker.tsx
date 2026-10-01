import React from 'react'
import { HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { AVAILABLE_PROMPT_ICONS, PromptIcon } from '@/components/reader/ai/PromptIcon'

export interface PromptIconPickerProps {
  value: string
  onChange: (iconName: string) => void
  label: string
}

export function PromptIconPicker({ value, onChange, label }: PromptIconPickerProps) {
  return (
    <VStack align="stretch" gap="1.5">
      <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
        {label}
      </Text>
      <HStack wrap="wrap" gap="2">
        {AVAILABLE_PROMPT_ICONS.map(function renderIconButton(iconName) {
          const isSelected = value === iconName
          return (
            <IconButton
              key={iconName}
              size="xs"
              variant={isSelected ? 'solid' : 'subtle'}
              colorPalette={isSelected ? 'ruby' : 'gray'}
              aria-label={`Select icon ${iconName}`}
              onClick={function handleSelect() {
                onChange(iconName)
              }}
            >
              <PromptIcon name={iconName} size={14} />
            </IconButton>
          )
        })}
      </HStack>
    </VStack>
  )
}
