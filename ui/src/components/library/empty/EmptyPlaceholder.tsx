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
      px="1.5rem"
      py="3rem"
    >
      <EmptyState.Root
        maxW="34rem"
        w="full"
        p="3rem 2.5rem"
        borderRadius="3xl"
        bg="glass.container"
        backdropFilter="blur(2rem)"
        borderWidth="0.0625rem"
        borderStyle="solid"
        borderColor="glass.borderSubtle"
        boxShadow="0 2rem 4.5rem -1rem {colors.blackA.9}, inset 0 0.0625rem 0.0625rem {colors.whiteA.3}"
        justifyContent="center"
        textAlign="center"
      >
        <EmptyState.Content gap="1.75rem">
          <EmptyState.Indicator>
            <EmptyIllustration />
          </EmptyState.Indicator>
          <EmptyState.Title
            fontFamily="heading"
            fontSize="2rem"
            fontWeight="bold"
            letterSpacing="-0.02em"
            backgroundImage="linear-gradient(135deg, #ffffff 40%, {colors.whiteA.9} 100%)"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t.emptyState.title}
          </EmptyState.Title>
          <EmptyState.Description
            fontSize="1rem"
            color="fg.muted"
            lineHeight="1.7"
            maxW="26rem"
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
