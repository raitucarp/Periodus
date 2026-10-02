import React, { useState, useRef, useEffect, useMemo } from 'react'
import type { Chapter } from '@/lib/types'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Layers, ChevronDown, Search, X, Check } from 'lucide-react'
import { cleanChapterTitle } from '@/lib/sentence'

export interface ReaderChapterSelectProps {
  currentChapterIdx: number
  chapters: Chapter[]
  formatOptionLabel?: (ch: Chapter) => string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onSelectChapter?: (chapterIndex: number) => void
}

export function ReaderChapterSelect({
  currentChapterIdx,
  chapters,
  onChange,
  onSelectChapter,
}: ReaderChapterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)

  const currentChapter = useMemo(
    () => chapters.find((c) => c.chapter_index === currentChapterIdx) || chapters[0],
    [chapters, currentChapterIdx]
  )

  const currentTitle = useMemo(
    () => (currentChapter ? cleanChapterTitle(currentChapter.title) : '') || `Chapter ${currentChapterIdx}`,
    [currentChapter, currentChapterIdx]
  )

  // Filter chapters by title or index
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters
    const q = searchQuery.toLowerCase().trim()
    return chapters.filter((ch) => {
      const title = cleanChapterTitle(ch.title).toLowerCase()
      const num = String(ch.chapter_index)
      return title.includes(q) || num === q || `#${num}`.includes(q)
    })
  }, [chapters, searchQuery])

  // Handle outside click & escape key
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        activeItemRef.current?.scrollIntoView({ block: 'nearest' })
      }, 50)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  function handleSelect(ch: Chapter) {
    if (onSelectChapter) {
      onSelectChapter(ch.chapter_index)
    } else if (onChange) {
      const syntheticEvent = {
        target: { value: String(ch.chapter_index) },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
    setIsOpen(false)
  }

  return (
    <Box position="relative" ref={containerRef}>
      {/* Non-native Trigger Button: 2-line display with subtle border */}
      <Flex
        role="button"
        tabIndex={0}
        align="center"
        justify="space-between"
        gap="2.5"
        w="16rem"
        maxW="18rem"
        py="1"
        px="2.5"
        rounded="lg"
        borderWidth="1px"
        borderColor={isOpen ? 'ruby.focus' : 'border.subtle'}
        bg={isOpen ? 'bg.subtle' : 'bg.surface'}
        color="fg"
        cursor="pointer"
        userSelect="none"
        transition="all 0.15s ease"
        _hover={{
          bg: 'bg.subtle',
          borderColor: 'border.default',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <HStack gap="2" minW="0" flex="1" align="center">
          <Square color="ruby.fg" size="4" flexShrink={0}>
            <Layers size={15} />
          </Square>
          <VStack align="start" gap="0" minW="0" flex="1">
            <HStack gap="1" align="center" lineHeight="1">
              <Text fontSize="2xs" fontWeight="semibold" color="fg.subtle">
                #{currentChapter?.chapter_index ?? currentChapterIdx}
              </Text>
              <Text fontSize="2xs" color="fg.subtle">
                ·
              </Text>
              <Text fontSize="2xs" color="fg.subtle">
                {currentChapter?.paragraph_count ?? 0} paragraphs
              </Text>
            </HStack>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg"
              lineClamp={1}
              textAlign="left"
              w="full"
            >
              {currentTitle}
            </Text>
          </VStack>
        </HStack>

        <Box
          color="fg.muted"
          flexShrink={0}
          transition="transform 0.2s ease"
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
        >
          <ChevronDown size={14} />
        </Box>
      </Flex>

      {/* Non-native Dropdown Popover */}
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          right="0"
          w="22rem"
          maxW="90vw"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.subtle"
          rounded="xl"
          shadow="2xl"
          zIndex="popover"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Search Header */}
          <HStack
            px="3"
            py="2"
            borderBottomWidth="1px"
            borderColor="border.subtle"
            gap="2"
            bg="bg.surface"
          >
            <Box color="fg.muted" flexShrink={0}>
              <Search size={14} />
            </Box>
            <Input
              ref={inputRef}
              size="xs"
              variant="subtle"
              placeholder="Search chapter title or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              flex="1"
              bg="transparent"
              borderWidth="0"
              _focus={{ outline: 'none', boxShadow: 'none' }}
              px="0"
            />
            {searchQuery && (
              <IconButton
                size="2xs"
                variant="ghost"
                colorPalette="gray"
                aria-label="Clear search"
                title="Clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={12} />
              </IconButton>
            )}
          </HStack>

          {/* Chapters Scrollable List */}
          <Box
            maxH="18rem"
            overflowY="auto"
            p="1.5"
            display="flex"
            flexDirection="column"
            gap="1"
            className="no-scrollbar"
          >
            {filteredChapters.length === 0 ? (
              <Box py="6" textAlign="center" color="fg.muted" fontSize="xs">
                No chapters found
              </Box>
            ) : (
              filteredChapters.map((ch) => {
                const isActive = ch.chapter_index === currentChapterIdx
                const cleanTitle = cleanChapterTitle(ch.title) || `Chapter ${ch.chapter_index}`

                return (
                  <Box
                    key={ch.id}
                    ref={isActive ? activeItemRef : undefined}
                    role="button"
                    tabIndex={0}
                    w="full"
                    textAlign="left"
                    p="2"
                    rounded="lg"
                    bg={isActive ? 'ruby.subtle' : 'transparent'}
                    borderLeftWidth={isActive ? '3px' : '0px'}
                    borderLeftColor="ruby.solid"
                    cursor="pointer"
                    transition="all 0.15s ease"
                    _hover={{
                      bg: isActive ? 'ruby.subtle' : 'bg.muted',
                    }}
                    onClick={() => handleSelect(ch)}
                  >
                    <Flex justify="space-between" align="center" gap="2">
                      <VStack align="start" gap="0.5" minW="0" flex="1">
                        {/* Baris 1: #1 . 3 paragraphs (teks lebih kecil, warna subtle) */}
                        <HStack gap="1.5" align="center" lineHeight="1">
                          <Text
                            fontSize="2xs"
                            fontWeight="semibold"
                            color={isActive ? 'ruby.fg' : 'fg.subtle'}
                          >
                            #{ch.chapter_index}
                          </Text>
                          <Text fontSize="2xs" color="fg.subtle">
                            ·
                          </Text>
                          <Text
                            fontSize="2xs"
                            color={isActive ? 'ruby.fg' : 'fg.subtle'}
                          >
                            {ch.paragraph_count} paragraphs
                          </Text>
                        </HStack>

                        {/* Baris 2: Judul bersih tanpa markdown syntax */}
                        <Text
                          fontSize="sm"
                          fontWeight={isActive ? 'bold' : 'medium'}
                          color={isActive ? 'ruby.fg' : 'fg'}
                          lineClamp={1}
                          wordBreak="break-word"
                        >
                          {cleanTitle}
                        </Text>
                      </VStack>

                      {isActive && (
                        <Box color="ruby.fg" flexShrink={0} mr="1">
                          <Check size={14} />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
