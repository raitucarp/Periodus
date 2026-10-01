import React from 'react'
import { Progress } from '@chakra-ui/react'

export interface BookProgressBarProps {
  percent: number
}

export function BookProgressBar({ percent }: BookProgressBarProps) {
  return (
    <Progress.Root
      value={percent}
      size="xs"
      colorPalette="ruby"
      variant="subtle"
      position="absolute"
      bottom="0"
      insetX="0"
    >
      <Progress.Track rounded="none">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
