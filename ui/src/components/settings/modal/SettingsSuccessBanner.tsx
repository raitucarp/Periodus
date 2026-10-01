import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'

export interface SettingsSuccessBannerProps {
  message: string
}

export function SettingsSuccessBanner({ message }: SettingsSuccessBannerProps) {
  return (
    <HStack gap="2" color="ruby.fg" textStyle="sm" mb="4">
      <Check size={16} />
      <Text>{message}</Text>
    </HStack>
  )
}
