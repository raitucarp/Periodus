import React from 'react'
import { Progress } from '@chakra-ui/react'

export interface ParagraphProgressBarProps {
  percent: number
}

export function ParagraphProgressBar({ percent }: ParagraphProgressBarProps) {
  return (
    <Progress.Root
      value={percent}
      size="xs"
      colorPalette="ruby"
      variant="subtle"
      w="full"
      mb="4"
    >
      <Progress.Track rounded="full">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
