import React from 'react'
import { Badge, HStack, Text, VStack } from '@chakra-ui/react'
import { AVAILABLE_COLOR_PALETTES } from '@/components/reader/ai/PromptIcon'

export interface PromptColorPickerProps {
  value: string
  onChange: (palette: string) => void
  label: string
}

export function PromptColorPicker({ value, onChange, label }: PromptColorPickerProps) {
  return (
    <VStack align="stretch" gap="1.5">
      <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
        {label}
      </Text>
      <HStack wrap="wrap" gap="2">
        {AVAILABLE_COLOR_PALETTES.map(function renderColorBadge(palette) {
          const isSelected = value === palette
          return (
            <Badge
              key={palette}
              colorPalette={palette}
              variant={isSelected ? 'solid' : 'subtle'}
              cursor="pointer"
              px="2.5"
              py="1"
              borderRadius="full"
              fontSize="xs"
              textTransform="capitalize"
              borderWidth={isSelected ? '2px' : '1px'}
              borderColor={isSelected ? 'border.emphasized' : 'border.subtle'}
              onClick={function handleClick() {
                onChange(palette)
              }}
            >
              {palette}
            </Badge>
          )
        })}
      </HStack>
    </VStack>
  )
}
