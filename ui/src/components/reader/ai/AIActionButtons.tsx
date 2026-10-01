import React from 'react'
import { Grid, Button } from '@chakra-ui/react'
import { PromptIcon } from './PromptIcon'
import type { Prompt } from '@/lib/types'

export interface AIActionButtonsProps {
  prompts: Prompt[]
  activeAction: string | null
  isLoading: boolean
  onActionClick: (promptId: string) => void
}

export function AIActionButtons({
  prompts,
  activeAction,
  isLoading,
  onActionClick,
}: AIActionButtonsProps) {
  // Only render prompts that are enabled by the user
  const activePrompts = prompts.filter(function isPromptActive(p) {
    return p.is_enabled === 1
  })

  if (activePrompts.length === 0) {
    return null
  }

  const columns = activePrompts.length <= 3 ? `repeat(${activePrompts.length}, 1fr)` : 'repeat(2, 1fr)'

  return (
    <Grid templateColumns={columns} gap="2" mb="5">
      {activePrompts.map(function renderButton(p) {
        const isSelected = activeAction === p.id
        const palette = p.color_palette || 'ruby'

        return (
          <Button
            key={p.id}
            size="sm"
            colorPalette={palette}
            variant={isSelected ? 'solid' : 'outline'}
            onClick={function handleClick() {
              onActionClick(p.id)
            }}
            disabled={isLoading}
            fontWeight="semibold"
            textStyle="xs"
            gap="1.5"
            px="2.5"
            py="1.5"
            title={p.description || p.name}
          >
            <PromptIcon name={p.icon || 'Sparkles'} size={14} />
            {p.name}
          </Button>
        )
      })}
    </Grid>
  )
}
