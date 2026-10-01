import React, { useState } from 'react'
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import { PromptIcon } from '@/components/reader/ai/PromptIcon'
import type { Prompt } from '@/lib/types'

export interface PromptCardProps {
  prompt: Prompt
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onToggleEnabled: (prompt: Prompt, enabled: boolean) => void
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onToggleEnabled,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isEnabled = prompt.is_enabled === 1
  const isBuiltin = prompt.is_builtin === 1

  return (
    <Box
      p="3.5"
      borderRadius="lg"
      borderWidth="1px"
      borderColor={isEnabled ? 'border.subtle' : 'border.muted'}
      bg={isEnabled ? 'bg.panel' : 'bg.muted'}
      opacity={isEnabled ? 1 : 0.7}
      transition="all 0.15s ease"
    >
      <HStack justify="space-between" align="center">
        <HStack gap="3" flex="1" minW="0">
          <Box
            p="2"
            borderRadius="md"
            bg={`${prompt.color_palette || 'ruby'}.subtle`}
            color={`${prompt.color_palette || 'ruby'}.solid`}
            flexShrink={0}
          >
            <PromptIcon name={prompt.icon || 'Sparkles'} size={18} />
          </Box>

          <VStack align="start" gap="0.5" minW="0" flex="1">
            <HStack gap="2" wrap="wrap">
              <Text textStyle="sm" fontWeight="semibold" truncate>
                {prompt.name}
              </Text>
              <Badge size="xs" variant="subtle" colorPalette={isBuiltin ? 'gray' : 'ruby'}>
                {isBuiltin ? 'Built-in' : 'Custom'}
              </Badge>
              <Badge size="xs" variant="outline" colorPalette="gray">
                #{prompt.sort_order || 0}
              </Badge>
              {prompt.provider && (
                <Badge size="xs" variant="surface" colorPalette="teal">
                  {prompt.provider}
                </Badge>
              )}
            </HStack>
            {prompt.description && (
              <Text textStyle="xs" color="fg.muted" lineClamp={1}>
                {prompt.description}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack gap="2" flexShrink={0}>
          <Switch.Root
            checked={isEnabled}
            onCheckedChange={function onCheck(e) {
              onToggleEnabled(prompt, e.checked)
            }}
            size="sm"
            colorPalette="ruby"
            title="Toggle reader button visibility"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>

          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Edit prompt"
            onClick={function handleEdit() {
              onEdit(prompt)
            }}
          >
            <Edit2 size={13} />
          </IconButton>

          {!isBuiltin && (
            <IconButton
              size="xs"
              variant="ghost"
              colorPalette="red"
              aria-label="Delete custom prompt"
              onClick={function handleDelete() {
                onDelete(prompt.id)
              }}
            >
              <Trash2 size={13} />
            </IconButton>
          )}

          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Toggle details"
            onClick={function toggleExpand() {
              setIsExpanded((prev) => !prev)
            }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </IconButton>
        </HStack>
      </HStack>

      {isExpanded && (
        <VStack
          align="stretch"
          gap="2"
          mt="3"
          pt="3"
          borderTopWidth="1px"
          borderColor="border.subtle"
        >
          {prompt.system_prompt && (
            <VStack align="stretch" gap="1">
              <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                System Instructions:
              </Text>
              <Box p="2" borderRadius="md" bg="bg.subtle" fontSize="xs" fontFamily="mono">
                {prompt.system_prompt}
              </Box>
            </VStack>
          )}

          <VStack align="stretch" gap="1">
            <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
              Prompt Template:
            </Text>
            <Box
              p="2"
              borderRadius="md"
              bg="bg.subtle"
              fontSize="xs"
              fontFamily="mono"
              whiteSpace="pre-wrap"
            >
              {prompt.user_prompt}
            </Box>
          </VStack>
        </VStack>
      )}
    </Box>
  )
}
