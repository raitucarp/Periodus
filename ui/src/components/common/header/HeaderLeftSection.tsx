import React from 'react'
import { HStack } from '@chakra-ui/react'
import { BookOpen } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { BrandTitle } from './BrandTitle'

export interface HeaderLeftSectionProps {
  title: string
  subtitle: string
}

export function HeaderLeftSection({ title, subtitle }: HeaderLeftSectionProps) {
  return (
    <HStack gap="3">
      <BrandLogo icon={<BookOpen size={20} />} />
      <BrandTitle title={title} subtitle={subtitle} />
    </HStack>
  )
}
