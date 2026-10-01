import React from 'react'
import { Button, HStack, Input, Text } from '@chakra-ui/react'
import { Plus, RotateCcw, Search } from 'lucide-react'

export interface PromptListToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddNew: () => void
  onResetDefaults: () => void
  totalCount: number
  enabledCount: number
  isResetting: boolean
}

export function PromptListToolbar({
  searchQuery,
  onSearchChange,
  onAddNew,
  onResetDefaults,
  totalCount,
  enabledCount,
  isResetting,
}: PromptListToolbarProps) {
  return (
    <HStack justify="space-between" wrap="wrap" gap="3">
      <HStack gap="2" flex="1" minW="14rem">
        <HStack
          px="2.5"
          py="1"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.subtle"
          bg="bg.panel"
          flex="1"
        >
          <Search size={14} color="gray" />
          <Input
            size="xs"
            variant="subtle"
            border="none"
            px="0"
            value={searchQuery}
            onChange={function onSearch(e) {
              onSearchChange(e.target.value)
            }}
            placeholder="Search prompts by name or keyword..."
          />
        </HStack>
        <Text textStyle="xs" color="fg.muted" flexShrink={0}>
          {enabledCount}/{totalCount} active
        </Text>
      </HStack>

      <HStack gap="2">
        <Button
          size="xs"
          variant="outline"
          colorPalette="gray"
          onClick={onResetDefaults}
          loading={isResetting}
          title="Restore factory default prompts"
        >
          <RotateCcw size={12} />
          Reset Defaults
        </Button>
        <Button
          size="xs"
          variant="solid"
          colorPalette="ruby"
          onClick={onAddNew}
        >
          <Plus size={12} />
          Add Prompt
        </Button>
      </HStack>
    </HStack>
  )
}
