import React from 'react'
import { createFileRoute, Link, Outlet, useNavigate, useRouter, useLocation } from '@tanstack/react-router'
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ArrowLeft, Sliders, Type, Bot } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { WindowControls } from '@/components/common/window'

export const Route = createFileRoute('/settings')({
  component: SettingsLayoutRoute,
})

function SettingsLayoutRoute() {
  const navigate = useNavigate()
  const router = useRouter()
  const location = useLocation()
  const { t } = useTranslation()

  function handleBack() {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      navigate({ to: '/' })
    }
  }

  const currentPath = location.pathname

  const isGeneralActive =
    currentPath.startsWith('/settings/general') ||
    currentPath === '/settings' ||
    currentPath === '/settings/'
  const isReaderActive = currentPath.startsWith('/settings/reader')
  const isAIActive = currentPath.startsWith('/settings/ai')

  const navItems = [
    {
      to: '/settings/general' as const,
      label: t.settings.tabGeneral,
      icon: <Sliders size={18} />,
      isActive: isGeneralActive,
    },
    {
      to: '/settings/reader' as const,
      label: t.settings.tabReader,
      icon: <Type size={18} />,
      isActive: isReaderActive,
    },
    {
      to: '/settings/ai' as const,
      label: t.settings.tabAI,
      icon: <Bot size={18} />,
      isActive: isAIActive,
    },
  ]

  return (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
      {/* Window Titlebar */}
      <Flex
        as="header"
        position="sticky"
        top="0"
        zIndex="sticky"
        layerStyle="glassHeader"
        px="6"
        py="3"
        align="center"
        justify="space-between"
        w="full"
        userSelect="none"
        style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
      >
        <HStack gap="3" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
          <IconButton
            variant="outline"
            colorPalette="gray"
            size="sm"
            aria-label="Back"
            title="Back"
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
          </IconButton>

          <HStack gap="2" ml="2">
            <Square size="1.75rem" rounded="md" bg="ruby.subtle" color="ruby.fg">
              <Sliders size={15} />
            </Square>
            <Text textStyle="sm" fontWeight="bold" color="fg">
              {t.app.title}
            </Text>
          </HStack>
        </HStack>

        <HStack gap="3" align="center" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
          <WindowControls />
        </HStack>
      </Flex>

      {/* Settings Page Header (Under the titlebar) */}
      <Box px="8" pt="7" pb="5" borderBottomWidth="1px" borderColor="border.subtle">
        <VStack align="start" gap="1">
          <Heading size="2xl" fontWeight="bold" letterSpacing="tight">
            {t.settings.title}
          </Heading>
          <Text textStyle="sm" color="fg.muted">
            {t.settings.description}
          </Text>
        </VStack>
      </Box>

      {/* Main Settings Body: Vertical Tabs on the Left & Full-Width Content on the Right */}
      <Flex flex="1" w="full" px="8" py="6" gap="8" align="start">
        {/* Left Vertical Navigation */}
        <VStack
          w="16rem"
          minW="16rem"
          align="stretch"
          gap="2"
          position="sticky"
          top="5.5rem"
        >
          {navItems.map(function renderNavItem(item) {
            return (
              <Button
                key={item.to}
                asChild
                size="md"
                variant={item.isActive ? 'solid' : 'ghost'}
                colorPalette={item.isActive ? 'ruby' : 'gray'}
                justifyContent="flex-start"
                gap="3"
                px="4"
                py="3"
                rounded="xl"
                fontWeight={item.isActive ? 'semibold' : 'medium'}
                bg={item.isActive ? 'ruby.solid' : 'transparent'}
                color={item.isActive ? 'white' : 'fg.muted'}
                _hover={{
                  bg: item.isActive ? 'ruby.solid' : 'bg.muted',
                  color: item.isActive ? 'white' : 'fg',
                }}
              >
                <Link to={item.to} replace>
                  {item.icon}
                  <Text textStyle="sm">{item.label}</Text>
                </Link>
              </Button>
            )
          })}
        </VStack>

        {/* Right Content Area - Wide & Spacious (No narrow container) */}
        <Box
          flex="1"
          minW="0"
          p="8"
          borderRadius="2xl"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.subtle"
          shadow="sm"
        >
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}
