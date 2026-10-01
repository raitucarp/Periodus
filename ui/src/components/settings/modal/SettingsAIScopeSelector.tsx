import React from 'react'
import {
  Box,
  HStack,
  NativeSelect,
  Text,
  VStack,
  Checkbox,
} from '@chakra-ui/react'
import { Globe2, BookMarked } from 'lucide-react'
import type { Book } from '@/lib/types'

export interface SettingsAIScopeSelectorProps {
  books: Book[]
  currentScope: string
  useGlobal: boolean
  onScopeChange: (scope: string) => void
  onUseGlobalChange: (useGlobal: boolean) => void
  scopeLabel: string
  scopeGlobalLabel: string
  useGlobalConfigLabel: string
}

export function SettingsAIScopeSelector({
  books,
  currentScope,
  useGlobal,
  onScopeChange,
  onUseGlobalChange,
  scopeLabel,
  scopeGlobalLabel,
  useGlobalConfigLabel,
}: SettingsAIScopeSelectorProps) {
  const isBookScope = currentScope !== '' && currentScope !== 'global'

  return (
    <Box
      p="3.5"
      rounded="xl"
      bg="bg.surface"
      borderColor="border.subtle"
      borderWidth="0.0625rem"
      mb="4"
    >
      <VStack align="stretch" gap="3">
        <HStack justify="space-between" align="center" flexWrap="wrap" gap="3">
          <HStack gap="2">
            {isBookScope ? (
              <BookMarked size={16} color="var(--chakra-colors-ruby-fg)" />
            ) : (
              <Globe2 size={16} color="var(--chakra-colors-ruby-fg)" />
            )}
            <Text textStyle="modal.fieldLabel" mb="0">
              {scopeLabel}
            </Text>
          </HStack>

          <Box minW="14rem">
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={currentScope}
                onChange={(e) => onScopeChange(e.currentTarget.value)}
                bg="glass.input"
                borderColor="glass.borderSubtle"
                rounded="lg"
                textStyle="xs"
              >
                <option
                  value="global"
                  style={{
                    backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                    color: 'inherit',
                  }}
                >
                  🌐 {scopeGlobalLabel}
                </option>
                {books.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    style={{
                      backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                      color: 'inherit',
                    }}
                  >
                    📖 {b.title} {b.author ? `— ${b.author}` : ''}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </HStack>

        {isBookScope && (
          <Box pt="1">
            <Checkbox.Root
              checked={useGlobal}
              onCheckedChange={(details) => onUseGlobalChange(Boolean(details.checked))}
              size="sm"
              colorPalette="ruby"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label textStyle="xs" color="fg.muted">
                {useGlobalConfigLabel}
              </Checkbox.Label>
            </Checkbox.Root>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
