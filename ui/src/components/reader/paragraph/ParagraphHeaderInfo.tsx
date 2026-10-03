import React, { useState } from 'react'
import { Box, Flex, HStack, Popover, Portal, Text, VStack } from '@chakra-ui/react'
import { BsParagraph } from 'react-icons/bs'
import { useAtomValue, useSetAtom } from 'jotai'
import { heatmapColorAtom, paragraphColorsAtom, setParagraphColorAtom } from '@/state/atoms'
import { RADIX_COLORS_ROW_1, RADIX_COLORS_ROW_2, RADIX_HEX_MAP } from '@/lib/radixColors'
import { ParagraphHeatmap } from '../heatmap/ParagraphHeatmap'
import { cleanChapterTitle } from '@/lib/sentence'
import type { ParagraphStat } from '@/lib/types'

export interface ParagraphHeaderInfoProps {
  chapterIndex: number
  totalChapters: number
  chapterTitle: string
  currentParagraphIndex: number
  totalParagraphs: number
  paragraphStats?: ParagraphStat[]
  onSelectParagraph?: (index: number) => void
  bookId?: string
}

export function ParagraphHeaderInfo({
  chapterIndex,
  totalChapters,
  chapterTitle,
  currentParagraphIndex,
  totalParagraphs,
  paragraphStats = [],
  onSelectParagraph = () => {},
  bookId = '',
}: ParagraphHeaderInfoProps) {
  const displayTitle = cleanChapterTitle(chapterTitle) || `Chapter ${chapterIndex}`
  const defaultHeatmapColor = useAtomValue(heatmapColorAtom)
  const paragraphColors = useAtomValue(paragraphColorsAtom)
  const setParagraphColor = useSetAtom(setParagraphColorAtom)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const pKey = `${bookId}_${chapterIndex}_${currentParagraphIndex}`
  const activeColor = paragraphColors[pKey] || defaultHeatmapColor || 'blue'

  return (
    <Box
      as="header"
      flexShrink={0}
      px="6"
      py="3"
      borderBottomWidth="1px"
      borderBottomColor="border.subtle"
      w="full"
      zIndex="base"
    >
      <Flex align="center" justify="space-between" gap="4">
        {/* Left Side: Paragraph Icon + 2-line Chapter Info vertically centered */}
        <HStack gap="3" align="center" flexShrink={0} maxW="45%">
          <Popover.Root
            open={showColorPicker}
            onOpenChange={(e) => setShowColorPicker(e.open)}
            positioning={{ placement: 'bottom-start', offset: { mainAxis: 8 } }}
          >
            <Popover.Trigger asChild>
              <Box
                role="button"
                tabIndex={0}
                w="9"
                h="9"
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="color-mix(in srgb, var(--chakra-colors-blue-solid, #0090ff) 16%, transparent)"
                color={RADIX_HEX_MAP[activeColor] || 'blue.solid'}
                cursor="pointer"
                transition="all 0.15s ease"
                _hover={{
                  bg: 'color-mix(in srgb, var(--chakra-colors-blue-solid, #0090ff) 26%, transparent)',
                  transform: 'scale(1.05)',
                }}
                title="Change Heatmap Color"
              >
                <BsParagraph size={22} />
              </Box>
            </Popover.Trigger>

            <Portal>
              <Popover.Positioner>
                <Popover.Content
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border.subtle"
                  p="2"
                  rounded="xl"
                  shadow="2xl"
                  zIndex="popover"
                  userSelect="none"
                  w="auto"
                >
                  <Popover.Body p="0" display="flex" flexDirection="column" gap="1.5">
                    <Text fontSize="2xs" fontWeight="semibold" color="fg.subtle">
                      Paragraph Heatmap Color
                    </Text>
                    {/* Row 1 */}
                    <HStack gap="1" align="center">
                      {RADIX_COLORS_ROW_1.map((c) => (
                        <Box
                          key={c.name}
                          w="5"
                          h="5"
                          rounded="md"
                          bg={c.hex}
                          cursor="pointer"
                          role="button"
                          aria-label={c.label}
                          border="1px solid rgba(0,0,0,0.15)"
                          outline={activeColor === c.name ? '2px solid var(--chakra-colors-fg)' : 'none'}
                          outlineOffset="1px"
                          transition="transform 0.12s ease"
                          _hover={{ transform: 'scale(1.22)' }}
                          title={c.label}
                          onClick={() => {
                            setParagraphColor({
                              bookId,
                              chapterIndex,
                              paragraphIndex: currentParagraphIndex,
                              color: c.name,
                            })
                            setShowColorPicker(false)
                          }}
                        />
                      ))}
                    </HStack>
                    {/* Row 2 */}
                    <HStack gap="1" align="center">
                      {RADIX_COLORS_ROW_2.map((c) => (
                        <Box
                          key={c.name}
                          w="5"
                          h="5"
                          rounded="md"
                          bg={c.hex}
                          cursor="pointer"
                          role="button"
                          aria-label={c.label}
                          border="1px solid rgba(0,0,0,0.15)"
                          outline={activeColor === c.name ? '2px solid var(--chakra-colors-fg)' : 'none'}
                          outlineOffset="1px"
                          transition="transform 0.12s ease"
                          _hover={{ transform: 'scale(1.22)' }}
                          title={c.label}
                          onClick={() => {
                            setParagraphColor({
                              bookId,
                              chapterIndex,
                              paragraphIndex: currentParagraphIndex,
                              color: c.name,
                            })
                            setShowColorPicker(false)
                          }}
                        />
                      ))}
                    </HStack>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          <VStack align="start" gap="0.5">
            <Text textStyle="xs" fontWeight="medium" color="fg.muted">
              #{chapterIndex} of {totalChapters}
            </Text>
            <Text textStyle="md" fontWeight="bold" color="fg" lineClamp={1}>
              {displayTitle}
            </Text>
          </VStack>
        </HStack>

        {/* Right-aligned: 3-row Paragraph Calendar Heatmap */}
        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          overflowX="auto"
          className="no-scrollbar"
          px="2"
        >
          <ParagraphHeatmap
            totalParagraphs={totalParagraphs}
            stats={paragraphStats}
            currentParagraphIndex={currentParagraphIndex}
            onSelectParagraph={onSelectParagraph}
            bookId={bookId}
            chapterIndex={chapterIndex}
          />
        </Box>

        {/* Right Side: 2-line Paragraph Status */}
        <VStack align="end" gap="0.5" flexShrink={0}>
          <Text textStyle="xs" fontWeight="medium" color="fg.subtle">
            Paragraph
          </Text>
          <HStack gap="0.5" align="baseline">
            <Text textStyle="xl" fontWeight="extrabold" color="fg" lineHeight="1">
              {currentParagraphIndex}
            </Text>
            <Text textStyle="sm" fontWeight="semibold" color="fg.muted" lineHeight="1">
              /{totalParagraphs}
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}

