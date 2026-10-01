import React, { useState } from 'react'
import {
  Button,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import type { ModelConfig } from '@/lib/types'

export interface SettingsAIChatSubTabProps {
  config: ModelConfig
  onChange: (updated: Partial<ModelConfig>) => void
  disabled?: boolean
  providerLabel: string
  modelLabel: string
  apiKeyLabel: string
  baseUrlLabel: string
  tempLabel: string
  maxTokensLabel: string
}

const PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI (ChatGPT)' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'glm', label: 'GLM (Zhipu AI)' },
  { value: 'custom', label: 'Custom (OpenAI-Compatible / Ollama)' },
]

const MODEL_PRESETS: Record<string, string[]> = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'gpt-4-turbo'],
  claude: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  glm: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'],
  custom: ['llama3.2', 'qwen2.5:7b', 'mistral-large', 'deepseek-r1'],
}

export function SettingsAIChatSubTab({
  config,
  onChange,
  disabled = false,
  providerLabel,
  modelLabel,
  apiKeyLabel,
  baseUrlLabel,
  tempLabel,
  maxTokensLabel,
}: SettingsAIChatSubTabProps) {
  const [showKey, setShowKey] = useState(false)
  const currentProvider = config.provider || 'gemini'
  const presets = MODEL_PRESETS[currentProvider] || []

  function handleProviderSelect(prov: string) {
    const defaultModel = (MODEL_PRESETS[prov] && MODEL_PRESETS[prov][0]) || ''
    let defaultBaseUrl = ''
    if (prov === 'deepseek') defaultBaseUrl = 'https://api.deepseek.com/chat/completions'
    if (prov === 'glm') defaultBaseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    if (prov === 'custom' && !config.baseUrl) defaultBaseUrl = 'http://localhost:11434/v1/chat/completions'

    onChange({
      provider: prov,
      model: defaultModel,
      baseUrl: defaultBaseUrl || config.baseUrl,
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
            {PROVIDERS.map((p) => (
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
            placeholder="Enter API key for this provider..."
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
            title={showKey ? 'Hide key' : 'Show key'}
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
          placeholder="Default endpoint (leave empty for standard cloud API)"
          bg="glass.input"
          borderColor="glass.borderSubtle"
          rounded="lg"
          _focus={{ borderColor: 'ruby.solid' }}
        />
      </VStack>

      {/* Temperature and Max Tokens */}
      <Grid templateColumns="1fr 1fr" gap="4">
        <VStack align="stretch" gap="1.5">
          <HStack justify="space-between">
            <Text textStyle="modal.fieldLabel">{tempLabel}</Text>
            <Text textStyle="xs" fontWeight="bold">
              {config.temperature ?? 0.7}
            </Text>
          </HStack>
          <Input
            size="sm"
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={config.temperature ?? 0.7}
            onChange={(e) => onChange({ temperature: parseFloat(e.currentTarget.value) || 0.7 })}
            bg="glass.input"
            borderColor="glass.borderSubtle"
            rounded="lg"
          />
        </VStack>

        <VStack align="stretch" gap="1.5">
          <HStack justify="space-between">
            <Text textStyle="modal.fieldLabel">{maxTokensLabel}</Text>
            <Text textStyle="xs" fontWeight="bold">
              {config.maxTokens ?? 2048}
            </Text>
          </HStack>
          <Input
            size="sm"
            type="number"
            step="256"
            min="256"
            max="16384"
            value={config.maxTokens ?? 2048}
            onChange={(e) => onChange({ maxTokens: parseInt(e.currentTarget.value, 10) || 2048 })}
            bg="glass.input"
            borderColor="glass.borderSubtle"
            rounded="lg"
          />
        </VStack>
      </Grid>
    </VStack>
  )
}
