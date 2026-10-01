import React from 'react'
import { Grid, Button } from '@chakra-ui/react'
import { BookOpenText, ListFilter, HelpCircle } from 'lucide-react'

export interface AIActionButtonsProps {
  activeAction: 'explain' | 'summarize' | 'vocabulary' | null
  isLoading: boolean
  explainLabel: string
  summarizeLabel: string
  vocabularyLabel: string
  onExplain: () => void
  onSummarize: () => void
  onVocabulary: () => void
}

export function AIActionButtons({
  activeAction,
  isLoading,
  explainLabel,
  summarizeLabel,
  vocabularyLabel,
  onExplain,
  onSummarize,
  onVocabulary,
}: AIActionButtonsProps) {
  const isExplain = activeAction === 'explain'
  const isSummarize = activeAction === 'summarize'
  const isVocabulary = activeAction === 'vocabulary'

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="0.5rem" mb="1.25rem">
      <Button
        size="sm"
        colorPalette="ruby"
        variant={isExplain ? 'solid' : 'outline'}
        onClick={onExplain}
        disabled={isLoading}
        fontWeight="semibold"
        textStyle="xs"
      >
        <HelpCircle size="0.875rem" />
        {explainLabel}
      </Button>

      <Button
        size="sm"
        colorPalette="ruby"
        variant={isSummarize ? 'solid' : 'outline'}
        onClick={onSummarize}
        disabled={isLoading}
        fontWeight="semibold"
        textStyle="xs"
      >
        <BookOpenText size="0.875rem" />
        {summarizeLabel}
      </Button>

      <Button
        size="sm"
        colorPalette="ruby"
        variant={isVocabulary ? 'solid' : 'outline'}
        onClick={onVocabulary}
        disabled={isLoading}
        fontWeight="semibold"
        textStyle="xs"
      >
        <ListFilter size="0.875rem" />
        {vocabularyLabel}
      </Button>
    </Grid>
  )
}
