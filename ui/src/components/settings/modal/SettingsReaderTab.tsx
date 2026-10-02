import React from 'react'
import {
  Box,
  Button,
  Grid,
  HStack,
  NativeSelect,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AlignLeft, AlignJustify, Type, Minus, Plus } from 'lucide-react'
import type { ReadingSettings } from '@/lib/types'

export interface SettingsReaderTabProps {
  settings: ReadingSettings
  onChange: (updated: Partial<ReadingSettings>) => void
  fontFamilyLabel: string
  fontSizeLabel: string
  lineHeightLabel: string
  maxWidthLabel: string
  textAlignLabel: string
  previewTitle: string
  previewText: string
}

const FONT_OPTIONS = [
  { value: 'Literata', label: 'Literata (Book Serif)' },
  { value: 'Newsreader', label: 'Newsreader (Editorial Serif)' },
  { value: 'Fraunces', label: 'Fraunces (Display Serif)' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern Sans)' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Monospace)' },
  { value: 'Georgia', label: 'Georgia (Classic Serif)' },
]

const LINE_HEIGHT_OPTIONS = [
  { value: 'normal', label: 'Compact (1.5)' },
  { value: 'tall', label: 'Balanced (1.7)' },
  { value: 'loose', label: 'Comfortable (1.8)' },
  { value: 'reading', label: 'Spacious (2.2)' },
]

const MAX_WIDTH_OPTIONS = [
  { value: '600px', label: 'Narrow (600px)' },
  { value: '700px', label: 'Medium (700px)' },
  { value: '800px', label: 'Standard (800px)' },
  { value: '900px', label: 'Wide (900px)' },
  { value: '100%', label: 'Full Width' },
]

export function SettingsReaderTab({
  settings,
  onChange,
  fontFamilyLabel,
  fontSizeLabel,
  lineHeightLabel,
  maxWidthLabel,
  textAlignLabel,
  previewTitle,
  previewText,
}: SettingsReaderTabProps) {
  const currentFontSize = settings.fontSize || 21

  function handleDecreaseFontSize() {
    if (currentFontSize > 14) {
      onChange({ fontSize: currentFontSize - 1 })
    }
  }

  function handleIncreaseFontSize() {
    if (currentFontSize < 28) {
      onChange({ fontSize: currentFontSize + 1 })
    }
  }

  return (
    <VStack align="stretch" gap="5" py="2">
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
        {/* Font Family */}
        <VStack align="stretch" gap="1.5">
          <Text textStyle="modal.fieldLabel">{fontFamilyLabel}</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={settings.fontFamily || 'Literata'}
              onChange={(e) => onChange({ fontFamily: e.currentTarget.value })}
              bg="glass.input"
              borderColor="glass.borderSubtle"
              rounded="lg"
            >
              {FONT_OPTIONS.map((f) => (
                <option
                  key={f.value}
                  value={f.value}
                  style={{
                    backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                    color: 'inherit',
                  }}
                >
                  {f.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </VStack>

        {/* Font Size Stepper */}
        <VStack align="stretch" gap="1.5">
          <Text textStyle="modal.fieldLabel">{fontSizeLabel}</Text>
          <HStack gap="2">
            <Button
              size="sm"
              variant="outline"
              colorPalette="gray"
              onClick={handleDecreaseFontSize}
              disabled={currentFontSize <= 14}
              px="3"
            >
              <Minus size={14} />
            </Button>
            <Box
              flex="1"
              textAlign="center"
              py="1.5"
              px="3"
              rounded="lg"
              borderWidth="0.0625rem"
              borderColor="glass.borderSubtle"
              bg="glass.input"
              fontWeight="bold"
              textStyle="sm"
            >
              {currentFontSize} px
            </Box>
            <Button
              size="sm"
              variant="outline"
              colorPalette="gray"
              onClick={handleIncreaseFontSize}
              disabled={currentFontSize >= 28}
              px="3"
            >
              <Plus size={14} />
            </Button>
          </HStack>
        </VStack>

        {/* Line Height */}
        <VStack align="stretch" gap="1.5">
          <Text textStyle="modal.fieldLabel">{lineHeightLabel}</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={settings.lineHeight || 'reading'}
              onChange={(e) => onChange({ lineHeight: e.currentTarget.value })}
              bg="glass.input"
              borderColor="glass.borderSubtle"
              rounded="lg"
            >
              {LINE_HEIGHT_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{
                    backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                    color: 'inherit',
                  }}
                >
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </VStack>

        {/* Column Width */}
        <VStack align="stretch" gap="1.5">
          <Text textStyle="modal.fieldLabel">{maxWidthLabel}</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={settings.maxWidth || '800px'}
              onChange={(e) => onChange({ maxWidth: e.currentTarget.value })}
              bg="glass.input"
              borderColor="glass.borderSubtle"
              rounded="lg"
            >
              {MAX_WIDTH_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{
                    backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                    color: 'inherit',
                  }}
                >
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </VStack>
      </Grid>

      {/* Text Alignment */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{textAlignLabel}</Text>
        <HStack gap="2">
          <Button
            size="sm"
            flex="1"
            colorPalette="ruby"
            variant={(settings.textAlign || 'left') === 'left' ? 'solid' : 'outline'}
            onClick={() => onChange({ textAlign: 'left' })}
            gap="2"
          >
            <AlignLeft size={14} />
            Left
          </Button>
          <Button
            size="sm"
            flex="1"
            colorPalette="ruby"
            variant={settings.textAlign === 'justify' ? 'solid' : 'outline'}
            onClick={() => onChange({ textAlign: 'justify' })}
            gap="2"
          >
            <AlignJustify size={14} />
            Justify
          </Button>
        </HStack>
      </VStack>

      {/* Live Preview Box */}
      <VStack align="stretch" gap="1.5" pt="2">
        <HStack justify="space-between" align="center">
          <Text textStyle="modal.fieldLabel" color="ruby.fg">
            {previewTitle}
          </Text>
          <HStack gap="1" color="fg.subtle">
            <Type size={12} />
            <Text textStyle="xs">
              {settings.fontFamily || 'Literata'} · {currentFontSize}px
            </Text>
          </HStack>
        </HStack>
        <Box
          p="5"
          rounded="xl"
          bg="bg.surface"
          borderColor="border.subtle"
          borderWidth="0.0625rem"
          boxShadow="sm"
        >
          <Text
            fontFamily={settings.fontFamily || 'Literata'}
            fontSize={`${currentFontSize}px`}
            lineHeight={
              settings.lineHeight === 'compact' || settings.lineHeight === 'normal'
                ? 1.5
                : settings.lineHeight === 'tall'
                ? 1.7
                : settings.lineHeight === 'loose'
                ? 1.8
                : 2.2
            }
            textAlign={(settings.textAlign as any) || 'left'}
            color="fg"
          >
            {previewText}
          </Text>
        </Box>
      </VStack>
    </VStack>
  )
}
