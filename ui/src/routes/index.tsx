import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/common/header'
import { EmptyPlaceholder } from '@/components/library/empty'
import { LibraryView } from '@/components/library/shelf'
import { useLibrary } from '@/hooks/useLibrary'
import { useTranslation } from '@/i18n'
import { Flex, Center, Spinner, Text } from '@chakra-ui/react'
import { match } from 'ts-pattern'
import { motion, AnimatePresence } from 'motion/react'

export const Route = createFileRoute('/')({
  component: IndexRoute,
})

interface AppLoadingScreenProps {
  label: string
}

function AppLoadingScreen({ label }: AppLoadingScreenProps) {
  return (
    <Center minH="60vh" flexDirection="column" gap="3">
      <Spinner size="lg" colorPalette="ruby" />
      <Text textStyle="sm" color="fg.muted">
        {label}
      </Text>
    </Center>
  )
}

function IndexRoute() {
  const navigate = useNavigate()
  const { isImporting, isLibraryEmpty, isLoading, importBook } = useLibrary()
  const { t } = useTranslation()

  function handleImport() {
    importBook()
  }

  function handleOpenSettings() {
    navigate({ to: '/settings/general' })
  }

  type LibraryState = 'loading' | 'empty' | 'catalog'
  const state: LibraryState = match({
    isLoading,
    isLibraryEmpty,
  })
    .with({ isLoading: true }, function toLoading() {
      return 'loading' as const
    })
    .with({ isLibraryEmpty: true }, function toEmpty() {
      return 'empty' as const
    })
    .otherwise(function toCatalog() {
      return 'catalog' as const
    })

  const mainView = match(state)
    .with('loading', function renderLoading() {
      return <AppLoadingScreen label={t.app.loadingLibrary} />
    })
    .with('empty', function renderEmpty() {
      return (
        <EmptyPlaceholder
          onImport={handleImport}
          isImporting={isImporting}
        />
      )
    })
    .with('catalog', function renderCatalog() {
      return <LibraryView />
    })
    .exhaustive()

  return (
    <Flex direction="column" minH="100vh" w="full">
      <Header
        onImport={handleImport}
        onOpenSettings={handleOpenSettings}
        isImporting={isImporting}
      />
      <Flex as="main" flex="1" direction="column" w="full">
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {mainView}
          </motion.div>
        </AnimatePresence>
      </Flex>
    </Flex>
  )
}
