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
import type { EmbeddingConfig } from '@/lib/types'

export interface SettingsAIEmbeddingSubTabProps {
  config: EmbeddingConfig
  onChange: (updated: Partial<EmbeddingConfig>) => void
  disabled?: boolean
  providerLabel: string
  modelLabel: string
  apiKeyLabel: string
  baseUrlLabel: string
  dimensionsLabel: string
}

const EMBEDDING_PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'custom', label: 'Custom (Ollama / Local / Compatible)' },
]

const EMBEDDING_PRESETS: Record<string, { model: string; dim: number }[]> = {
  gemini: [
    { model: 'text-embedding-004', dim: 768 },
    { model: 'embedding-001', dim: 768 },
  ],
  openai: [
    { model: 'text-embedding-3-small', dim: 1536 },
    { model: 'text-embedding-3-large', dim: 3072 },
    { model: 'text-embedding-ada-002', dim: 1536 },
  ],
  custom: [
    { model: 'nomic-embed-text', dim: 768 },
    { model: 'bge-m3', dim: 1024 },
    { model: 'all-minilm', dim: 384 },
  ],
}

export function SettingsAIEmbeddingSubTab({
  config,
  onChange,
  disabled = false,
  providerLabel,
  modelLabel,
  apiKeyLabel,
  baseUrlLabel,
  dimensionsLabel,
}: SettingsAIEmbeddingSubTabProps) {
  const [showKey, setShowKey] = useState(false)
  const currentProvider = config.provider || 'gemini'
  const presets = EMBEDDING_PRESETS[currentProvider] || []

  function handleProviderSelect(prov: string) {
    const defaultPreset = EMBEDDING_PRESETS[prov]?.[0]
    onChange({
      provider: prov,
      model: defaultPreset?.model || '',
      dimensions: defaultPreset?.dim || 768,
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
            {EMBEDDING_PROVIDERS.map((p) => (
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
          placeholder="e.g. text-embedding-004 or text-embedding-3-small"
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
                key={preset.model}
                size="2xs"
                variant={config.model === preset.model ? 'solid' : 'outline'}
                colorPalette="ruby"
                onClick={() => onChange({ model: preset.model, dimensions: preset.dim })}
                rounded="full"
                fontSize="10px"
              >
                {preset.model} ({preset.dim}d)
              </Button>
            ))}
          </HStack>
        )}
      </VStack>

      {/* Dimensions and API Key */}
      <Grid templateColumns="1fr 2fr" gap="4">
        <VStack align="stretch" gap="1.5">
          <Text textStyle="modal.fieldLabel">{dimensionsLabel}</Text>
          <Input
            size="sm"
            type="number"
            value={config.dimensions || 768}
            onChange={(e) => onChange({ dimensions: parseInt(e.currentTarget.value, 10) || 768 })}
            bg="glass.input"
            borderColor="glass.borderSubtle"
            rounded="lg"
          />
        </VStack>

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
      </Grid>

      {/* Base URL (Optional / Custom) */}
      <VStack align="stretch" gap="1.5">
        <Text textStyle="modal.fieldLabel">{baseUrlLabel}</Text>
        <Input
          size="sm"
          value={config.baseUrl || ''}
          onChange={(e) => onChange({ baseUrl: e.currentTarget.value })}
          placeholder="Default endpoint (e.g. http://localhost:11434/v1/embeddings)"
          bg="glass.input"
          borderColor="glass.borderSubtle"
          rounded="lg"
          _focus={{ borderColor: 'ruby.solid' }}
        />
      </VStack>
    </VStack>
  )
}
