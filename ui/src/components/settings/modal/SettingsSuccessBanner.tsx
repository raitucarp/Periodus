import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'

export interface SettingsSuccessBannerProps {
  message: string
}

export function SettingsSuccessBanner({ message }: SettingsSuccessBannerProps) {
  return (
    <HStack gap="0.5rem" color="ruby.fg" textStyle="sm" mb="1rem">
      <Check size="1rem" />
      <Text>{message}</Text>
    </HStack>
  )
}
