import React, { useState } from 'react'
import {
  Button,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import type { VisionConfig } from '@/lib/types'

export interface SettingsAIVisionSubTabProps {
  config: VisionConfig
  onChange: (updated: Partial<VisionConfig>) => void
  disabled?: boolean
  providerLabel: string
  modelLabel: string
  apiKeyLabel: string
  baseUrlLabel: string
}

const VISION_PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI (GPT-4o)' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'custom', label: 'Custom (Ollama / Local)' },
]

const VISION_PRESETS: Record<string, string[]> = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash'],
  openai: ['gpt-4o', 'gpt-4o-mini'],
  claude: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022'],
  custom: ['llava', 'bakllava', 'minicpm-v'],
}

export function SettingsAIVisionSubTab({
  config,
  onChange,
  disabled = false,
  providerLabel,
  modelLabel,
  apiKeyLabel,
  baseUrlLabel,
}: SettingsAIVisionSubTabProps) {
  const [showKey, setShowKey] = useState(false)
  const currentProvider = config.provider || 'gemini'
  const presets = VISION_PRESETS[currentProvider] || []

  function handleProviderSelect(prov: string) {
    const defaultModel = (VISION_PRESETS[prov] && VISION_PRESETS[prov][0]) || ''
    onChange({
      provider: prov,
      model: defaultModel,
    })
  }

  return (
    <VStack align="stretch" gap="4" opacity={disabled ? 0.6 : 1} pointerEvents={disabled ? 'none' : 'auto'}>
      {/* Provider Selector */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{providerLabel}</Text>
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={currentProvider}
            onChange={(e) => handleProviderSelect(e.currentTarget.value)}
            bg="glass.input"
            borderColor="glass.borderSubtle"
            rounded="lg"
          >
            {VISION_PROVIDERS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{
                  backgroundColor: 'var(--chakra-colors-bg-surface, #1e1e24)',
                  color: 'inherit',
                }}
              >
                {p.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </VStack>

      {/* Model Name and Quick Presets */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{modelLabel}</Text>
        <Input
          size="sm"
          value={config.model || ''}
          onChange={(e) => onChange({ model: e.currentTarget.value })}
          placeholder="e.g. gemini-2.5-flash or gpt-4o"
          bg="glass.input"
          borderColor="glass.borderSubtle"
          rounded="lg"
          _focus={{ borderColor: 'ruby.solid' }}
        />
        {presets.length > 0 && (
          <HStack gap="1.5" flexWrap="wrap" pt="1">
            <Sparkles size={12} color="var(--chakra-colors-ruby-fg)" />
            {presets.map((preset) => (
              <Button
                key={preset}
                size="2xs"
                variant={config.model === preset ? 'solid' : 'outline'}
                colorPalette="ruby"
                onClick={() => onChange({ model: preset })}
                rounded="full"
                fontSize="10px"
              >
                {preset}
              </Button>
            ))}
          </HStack>
        )}
      </VStack>

      {/* API Key */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{apiKeyLabel}</Text>
        <HStack gap="2">
          <Input
            size="sm"
            type={showKey ? 'text' : 'password'}
            value={config.apiKey || ''}
            onChange={(e) => onChange({ apiKey: e.currentTarget.value })}
            placeholder="API Key (optional if using Chat key)..."
            bg="glass.input"
            borderColor="glass.borderSubtle"
            rounded="lg"
            _focus={{ borderColor: 'ruby.solid' }}
          />
          <Button
            size="sm"
            variant="outline"
            colorPalette="gray"
            onClick={() => setShowKey(!showKey)}
            px="3"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
        </HStack>
      </VStack>

      {/* Base URL (Optional / Custom) */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{baseUrlLabel}</Text>
        <Input
          size="sm"
          value={config.baseUrl || ''}
          onChange={(e) => onChange({ baseUrl: e.currentTarget.value })}
          placeholder="Default endpoint"
          bg="glass.input"
          borderColor="glass.borderSubtle"
          rounded="lg"
          _focus={{ borderColor: 'ruby.solid' }}
        />
      </VStack>
    </VStack>
  )
}
