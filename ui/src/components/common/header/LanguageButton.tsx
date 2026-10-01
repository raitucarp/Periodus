import React from 'react'
import { Button, HStack, Menu, Portal, Text } from '@chakra-ui/react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { type Locale, SUPPORTED_LOCALES } from '@/i18n'

export interface LanguageButtonProps {
  locale: Locale
  label: string
  onSelectLocale: (locale: Locale) => void
}

export function LanguageButton({ locale, label, onSelectLocale }: LanguageButtonProps) {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end', gutter: 6 }}>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          colorPalette="gray"
          title={label}
          px="2.5"
          gap="1.5"
          aria-label={label}
        >
          <Globe size={14} />
          <Text as="span" textTransform="uppercase" fontWeight="bold" textStyle="xs">
            {locale}
          </Text>
          <ChevronDown size={12} opacity={0.6} />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="bg.surface"
            borderColor="border.subtle"
            borderWidth="0.0625rem"
            boxShadow="lg"
            minW="12rem"
            p="1"
            rounded="xl"
            zIndex="dropdown"
          >
            {SUPPORTED_LOCALES.map(({ code, nativeName, label: langLabel }) => {
              const isSelected = code === locale
              return (
                <Menu.Item
                  key={code}
                  value={code}
                  onClick={() => onSelectLocale(code)}
                  cursor="pointer"
                  justifyContent="space-between"
                  px="3"
                  py="2"
                  rounded="md"
                  bg={isSelected ? 'bg.hover' : 'transparent'}
                  color={isSelected ? 'ruby.solid' : 'fg'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  _hover={{ bg: 'bg.hover' }}
                >
                  <HStack gap="2">
                    <Text as="span" textStyle="xs">
                      {nativeName}
                    </Text>
                    <Text as="span" textStyle="caption" color="fg.subtle">
                      ({langLabel})
                    </Text>
                  </HStack>
                  {isSelected && <Check size={14} />}
                </Menu.Item>
              )
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export const LanguageDropdown = LanguageButton
export type LanguageDropdownProps = LanguageButtonProps
