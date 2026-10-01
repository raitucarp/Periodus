import React from 'react'
import { EmptyState, Box } from '@chakra-ui/react'
import { match } from 'ts-pattern'
import { useTranslation } from '@/i18n'
import { EmptyIllustration } from './EmptyIllustration'
import { EmptyActionButton } from './EmptyActionButton'

export interface EmptyPlaceholderProps {
  onImport: () => void
  isImporting?: boolean
}

export function EmptyPlaceholder({ onImport, isImporting = false }: EmptyPlaceholderProps) {
  const { t } = useTranslation()

  function handleActionClick() {
    onImport()
  }

  const actionLabel = match(Boolean(isImporting))
    .with(true, function importing() {
      return t.emptyState.importingAction
    })
    .with(false, function idle() {
      return t.emptyState.importAction
    })
    .exhaustive()

  const bodyContent = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="1"
      minH="calc(100vh - 5rem)"
      px="6"
      py="12"
    >
      <EmptyState.Root
        maxW="emptyStateMax"
        w="full"
        p="12"
        layerStyle="emptyStateCard"
        justifyContent="center"
        textAlign="center"
      >
        <EmptyState.Content gap="7">
          <EmptyState.Indicator>
            <EmptyIllustration />
          </EmptyState.Indicator>
          <EmptyState.Title
            textStyle="brand.emptyTitle"
            backgroundImage="{colors.gradient.brandTextTitle}"
            bgClip="text"
          >
            {t.emptyState.title}
          </EmptyState.Title>
          <EmptyState.Description
            textStyle="md"
            color="fg.muted"
            lineHeight="tall"
            maxW="emptyStateContentMax"
            mx="auto"
          >
            {t.emptyState.description}
          </EmptyState.Description>
          <EmptyActionButton
            isImporting={Boolean(isImporting)}
            label={actionLabel}
            onClick={handleActionClick}
          />
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  )

  return bodyContent
}
