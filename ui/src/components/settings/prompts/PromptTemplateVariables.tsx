import React from 'react'
import { Badge, HStack, Text, VStack } from '@chakra-ui/react'

export interface PromptTemplateVariablesProps {
  onInsert: (variableTag: string) => void
  label: string
}

const TEMPLATE_VARIABLES = [
  { tag: '{{text}}', description: 'Selected paragraph text' },
  { tag: '{{book_title}}', description: 'Book title' },
  { tag: '{{author}}', description: 'Book author' },
  { tag: '{{language}}', description: 'Book language' },
] as const

export function PromptTemplateVariables({ onInsert, label }: PromptTemplateVariablesProps) {
  return (
    <VStack align="stretch" gap="1">
      <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
        {label}
      </Text>
      <HStack wrap="wrap" gap="2">
        {TEMPLATE_VARIABLES.map(function renderVarBadge(v) {
          return (
            <Badge
              key={v.tag}
              variant="subtle"
              colorPalette="ruby"
              cursor="pointer"
              title={v.description}
              px="2"
              py="0.5"
              borderRadius="md"
              fontFamily="mono"
              fontSize="xs"
              onClick={function handleClick() {
                onInsert(v.tag)
              }}
            >
              + {v.tag}
            </Badge>
          )
        })}
      </HStack>
    </VStack>
  )
}
