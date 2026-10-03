import React from 'react'
import { Flex, HStack, Button, Text, Square, Separator, VStack } from '@chakra-ui/react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { WindowControls } from '@/components/common/window'
import { LanguageButton, ThemeToggleButton, SettingsButton } from '@/components/common/header'
import { useTranslation } from '@/i18n'
import { ChapterHeatmap } from '../heatmap/ChapterHeatmap'
import type { ChapterHeatmapItem } from '@/lib/types'

export interface ReaderTopNavProps {
  bookTitle: string
  author?: string
  totalChapters?: number
  chapterHeatmapData?: ChapterHeatmapItem[]
  currentChapterIndex?: number
  onSelectChapter?: (idx: number) => void
  backLabel: string
  onBack: () => void
  onOpenSettings?: () => void
  children?: React.ReactNode
}

export function ReaderTopNav({
  bookTitle,
  author,
  totalChapters = 1,
  chapterHeatmapData = [],
  currentChapterIndex = 1,
  onSelectChapter = () => {},
  backLabel,
  onBack,
  onOpenSettings,
  children,
}: ReaderTopNavProps) {
  const { locale, changeLocale, t } = useTranslation()
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      align="center"
      justify="space-between"
      pl="6"
      pr="0"
      py="0"
      h="12"
      layerStyle="glassHeader"
      w="full"
      userSelect="none"
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
    >
      {/* Left Area: Catalog Button & 2-Line Author/Title */}
      <HStack gap="3" flexShrink={1} maxW="45%" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={onBack}
          flexShrink={0}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Button>

        <HStack gap="2.5" ml="1" minW="0" flex="1">
          <Square color="ruby.solid" size="1.75rem" rounded="md" bg="ruby.subtle" flexShrink={0}>
            <BookOpen size={15} />
          </Square>
          <VStack align="start" gap="0.5" minW="0" flex="1">
            {author && (
              <Text textStyle="xs" color="fg.subtle" fontWeight="medium" lineHeight="1.2">
                {author}
              </Text>
            )}
            <Text
              textStyle="md"
              fontWeight="bold"
              color="fg"
              lineClamp={2}
              title={bookTitle}
              lineHeight="1.25"
            >
              {bookTitle}
            </Text>
          </VStack>
        </HStack>
      </HStack>

      {/* Middle Area: Green Line Chapter Calendar Heatmap */}
      <HStack
        flex="1"
        justify="center"
        px="4"
        style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
      >
        <ChapterHeatmap
          totalChapters={totalChapters}
          heatmapItems={chapterHeatmapData}
          currentChapterIndex={currentChapterIndex}
          onSelectChapter={onSelectChapter}
        />
      </HStack>

      {/* Right Area: Chapter Selector, Additional Tools & Window Controls */}
      <HStack gap="2" align="center" h="full" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        {children}
        <ThemeToggleButton label={t.header.themeToggleLabel} />
        <LanguageButton
          locale={locale}
          label={t.header.languageLabel}
          onSelectLocale={changeLocale}
        />
        {onOpenSettings && (
          <SettingsButton
            label={t.header.settingsTitle}
            onClick={onOpenSettings}
          />
        )}
        <Separator orientation="vertical" h="4" borderColor="border.subtle" mx="1" />
        <WindowControls />
      </HStack>
    </Flex>
  )
}
