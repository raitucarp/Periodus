import React from 'react'
import { AmbientBackground } from '@/components/common/ambient'
import { Header } from '@/components/common/header'
import { EmptyPlaceholder } from '@/components/library/empty'
import { LibraryView } from '@/components/library/shelf'
import { ReaderView } from '@/components/reader/view'
import { SettingsModal } from '@/components/settings/modal'
import { useLibrary } from '@/hooks/useLibrary'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation } from '@/i18n'
import { Flex, Center, Spinner, Text } from '@chakra-ui/react'
import { match } from 'ts-pattern'
import { motion, AnimatePresence } from 'motion/react'
import type { Book } from '@/lib/types'

interface AppLoadingScreenProps {
  label: string
}

function AppLoadingScreen({ label }: AppLoadingScreenProps) {
  return (
    <Center minH="60vh" flexDirection="column" gap="0.75rem">
      <Spinner size="lg" colorPalette="ruby" />
      <Text textStyle="sm" color="fg.muted">
        {label}
      </Text>
    </Center>
  )
}

interface AppReaderScreenProps {
  book: Book
  onBack: () => void
  onOpenSettings: () => void
}

function AppReaderScreen({ book, onBack, onOpenSettings }: AppReaderScreenProps) {
  return (
    <AmbientBackground>
      <ReaderView
        book={book}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />
      <SettingsModal />
    </AmbientBackground>
  )
}

interface AppMainLibraryProps {
  isImporting: boolean
  isLibraryEmpty: boolean
  isLoading: boolean
  loadingLabel: string
  onImport: () => void
  onOpenSettings: () => void
}

function AppMainLibrary({
  isImporting,
  isLibraryEmpty,
  isLoading,
  loadingLabel,
  onImport,
  onOpenSettings,
}: AppMainLibraryProps) {
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
      return <AppLoadingScreen label={loadingLabel} />
    })
    .with('empty', function renderEmpty() {
      return (
        <EmptyPlaceholder
          onImport={onImport}
          isImporting={isImporting}
        />
      )
    })
    .with('catalog', function renderCatalog() {
      return <LibraryView />
    })
    .exhaustive()

  return (
    <AmbientBackground>
      <Header
        onImport={onImport}
        onOpenSettings={onOpenSettings}
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
      <SettingsModal />
    </AmbientBackground>
  )
}

export function App() {
  const {
    selectedBook,
    isLoading,
    isImporting,
    isLibraryEmpty,
    importBook,
    clearSelectedBook,
    loadBooks,
  } = useLibrary()

  const { openSettings } = useSettings()
  const { t } = useTranslation()

  function handleImportBook() {
    importBook()
  }

  function handleOpenSettings() {
    openSettings()
  }

  function handleBackToLibrary() {
    clearSelectedBook()
    loadBooks()
  }

  const appLayout = match(Boolean(selectedBook))
    .with(true, function renderReader() {
      return (
        <motion.div
          key="reader-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%' }}
        >
          <AppReaderScreen
            book={selectedBook!}
            onBack={handleBackToLibrary}
            onOpenSettings={handleOpenSettings}
          />
        </motion.div>
      )
    })
    .with(false, function renderCatalog() {
      return (
        <motion.div
          key="catalog-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%' }}
        >
          <AppMainLibrary
            isImporting={isImporting}
            isLibraryEmpty={isLibraryEmpty}
            isLoading={isLoading}
            loadingLabel={t.app.loadingLibrary}
            onImport={handleImportBook}
            onOpenSettings={handleOpenSettings}
          />
        </motion.div>
      )
    })
    .exhaustive()

  const renderedApp = (
    <AnimatePresence mode="wait">
      {appLayout}
    </AnimatePresence>
  )

  return renderedApp
}

export default App
