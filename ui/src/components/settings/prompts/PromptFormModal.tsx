import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  HStack,
  Input,
  NativeSelect,
  Slider,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { PromptIconPicker } from './PromptIconPicker'
import { PromptColorPicker } from './PromptColorPicker'
import { PromptTemplateVariables } from './PromptTemplateVariables'
import { PromptIcon } from '@/components/reader/ai/PromptIcon'
import type { Prompt } from '@/lib/types'

export interface PromptFormModalProps {
  isOpen: boolean
  promptToEdit: Prompt | null
  onClose: () => void
  onSave: (prompt: Prompt) => Promise<void>
}

export function PromptFormModal({
  isOpen,
  promptToEdit,
  onClose,
  onSave,
}: PromptFormModalProps) {
  const isEditing = Boolean(promptToEdit)

  const [name, setName] = useState(promptToEdit?.name || '')
  const [description, setDescription] = useState(promptToEdit?.description || '')
  const [icon, setIcon] = useState(promptToEdit?.icon || 'Sparkles')
  const [colorPalette, setColorPalette] = useState(promptToEdit?.color_palette || 'ruby')
  const [systemPrompt, setSystemPrompt] = useState(
    promptToEdit?.system_prompt || 'You are an insightful reading companion and literary scholar.'
  )
  const [userPrompt, setUserPrompt] = useState(
    promptToEdit?.user_prompt || 'Analyze and explain the context, subtext, and literary nuances of the following passage:\n\n{{text}}'
  )
  const [provider, setProvider] = useState(promptToEdit?.provider || '')
  const [model, setModel] = useState(promptToEdit?.model || '')
  const [temperature, setTemperature] = useState(promptToEdit?.temperature ?? 0.7)
  const [maxTokens, setMaxTokens] = useState(promptToEdit?.max_tokens ?? 2048)
  const [isEnabled, setIsEnabled] = useState(promptToEdit ? promptToEdit.is_enabled === 1 : true)
  const [sortOrder, setSortOrder] = useState(promptToEdit?.sort_order ?? 1)
  const [isSaving, setIsSaving] = useState(false)

  function handleInsertVariable(tag: string) {
    setUserPrompt(function appendTag(prev) {
      return prev + (prev.endsWith('\n') || prev === '' ? '' : ' ') + tag
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !userPrompt.trim()) return

    setIsSaving(true)
    try {
      const promptData: Prompt = {
        id: promptToEdit ? promptToEdit.id : `prompt-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        icon,
        color_palette: colorPalette,
        system_prompt: systemPrompt.trim(),
        user_prompt: userPrompt.trim(),
        provider,
        model: model.trim(),
        temperature,
        max_tokens: maxTokens,
        is_builtin: promptToEdit ? promptToEdit.is_builtin : 0,
        is_enabled: isEnabled ? 1 : 0,
        sort_order: sortOrder,
        scope: promptToEdit ? promptToEdit.scope : 'global',
        book_id: promptToEdit ? promptToEdit.book_id : '',
        created_at: promptToEdit ? promptToEdit.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await onSave(promptData)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={function onOpenChange(e) { if (!e.open) onClose() }}>
      <Dialog.Backdrop backdropFilter="blur(4px)" bg="blackAlpha.700" />
      <Dialog.Positioner>
        <Dialog.Content
          as="form"
          onSubmit={handleSubmit}
          maxW="48rem"
          maxH="90vh"
          overflowY="auto"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="xl"
          p="6"
        >
          <Dialog.Header p="0" mb="4">
            <HStack justify="space-between" align="center">
              <HStack gap="3">
                <Box
                  p="2"
                  borderRadius="md"
                  bg={`${colorPalette}.subtle`}
                  color={`${colorPalette}.solid`}
                >
                  <PromptIcon name={icon} size={20} />
                </Box>
                <VStack align="start" gap="0">
                  <Dialog.Title textStyle="lg" fontWeight="semibold">
                    {isEditing ? `Edit Prompt: ${promptToEdit?.name}` : 'Create New AI Analysis Prompt'}
                  </Dialog.Title>
                  <Text textStyle="xs" color="fg.muted">
                    Configure custom action buttons and prompts for reader text analysis
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Dialog.Header>

          <Dialog.Body p="0">
            <VStack align="stretch" gap="5">
              {/* Row 1: Name & Sort Order & Enabled */}
              <HStack align="start" gap="4">
                <VStack align="stretch" gap="1.5" flex="1">
                  <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                    Button Title / Name *
                  </Text>
                  <Input
                    size="sm"
                    value={name}
                    onChange={function onNameChange(e) {
                      setName(e.target.value)
                    }}
                    placeholder="e.g. Literary Critique"
                    required
                  />
                </VStack>

                <VStack align="stretch" gap="1.5" w="6rem">
                  <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                    Order
                  </Text>
                  <Input
                    size="sm"
                    type="number"
                    value={sortOrder}
                    onChange={function onOrderChange(e) {
                      setSortOrder(parseInt(e.target.value, 10) || 0)
                    }}
                  />
                </VStack>

                <VStack align="start" gap="1.5" pt="1">
                  <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                    Show in Reader
                  </Text>
                  <Switch.Root
                    checked={isEnabled}
                    onCheckedChange={function onCheck(e) {
                      setIsEnabled(e.checked)
                    }}
                    colorPalette="ruby"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </VStack>
              </HStack>

              {/* Description */}
              <VStack align="stretch" gap="1.5">
                <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                  Description
                </Text>
                <Input
                  size="sm"
                  value={description}
                  onChange={function onDescChange(e) {
                    setDescription(e.target.value)
                  }}
                  placeholder="e.g. Analyze prose style, pacing, and figurative language"
                />
              </VStack>

              {/* Row 2: Icon & Color Palette Pickers */}
              <HStack align="start" gap="6">
                <Box flex="1">
                  <PromptIconPicker
                    value={icon}
                    onChange={setIcon}
                    label="Toolbar Button Icon"
                  />
                </Box>
                <Box flex="1">
                  <PromptColorPicker
                    value={colorPalette}
                    onChange={setColorPalette}
                    label="Accent Color Palette"
                  />
                </Box>
              </HStack>

              {/* System Prompt */}
              <VStack align="stretch" gap="1.5">
                <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                  System Instructions (Role Definition)
                </Text>
                <Textarea
                  size="sm"
                  rows={2}
                  value={systemPrompt}
                  onChange={function onSysChange(e) {
                    setSystemPrompt(e.target.value)
                  }}
                  placeholder="You are an expert reading assistant..."
                />
              </VStack>

              {/* User Prompt Template */}
              <VStack align="stretch" gap="2">
                <HStack justify="space-between" align="center">
                  <Text textStyle="xs" fontWeight="semibold" color="fg.muted">
                    User Prompt Template *
                  </Text>
                  <PromptTemplateVariables
                    onInsert={handleInsertVariable}
                    label="Insert Placeholder:"
                  />
                </HStack>
                <Textarea
                  size="sm"
                  rows={4}
                  value={userPrompt}
                  onChange={function onUserPromptChange(e) {
                    setUserPrompt(e.target.value)
                  }}
                  placeholder="Analisis teks berikut:\n\n{{text}}"
                  required
                />
              </VStack>

              {/* Advanced Model & Generation Overrides */}
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.subtle"
                borderWidth="1px"
                borderColor="border.subtle"
              >
                <Text textStyle="xs" fontWeight="bold" textTransform="uppercase" color="fg.muted" mb="3">
                  Model & Parameter Overrides (Optional)
                </Text>
                <VStack align="stretch" gap="3">
                  <HStack gap="4">
                    <VStack align="stretch" gap="1" flex="1">
                      <Text textStyle="xs" color="fg.muted">
                        Provider Override
                      </Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={provider}
                          onChange={function onProv(e) {
                            setProvider(e.target.value)
                          }}
                        >
                          <option value="">(Inherit Global / Book Default)</option>
                          <option value="gemini">Google Gemini</option>
                          <option value="openai">OpenAI (ChatGPT)</option>
                          <option value="anthropic">Anthropic Claude</option>
                          <option value="deepseek">DeepSeek</option>
                          <option value="glm">GLM (Zhipu AI)</option>
                          <option value="custom">Custom (OpenAI Compatible)</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </VStack>

                    <VStack align="stretch" gap="1" flex="1">
                      <Text textStyle="xs" color="fg.muted">
                        Model Name Override
                      </Text>
                      <Input
                        size="sm"
                        value={model}
                        onChange={function onMod(e) {
                          setModel(e.target.value)
                        }}
                        placeholder="Inherit or custom model"
                      />
                    </VStack>
                  </HStack>

                  <HStack gap="4" align="center">
                    <VStack align="stretch" gap="1" flex="1">
                      <HStack justify="space-between">
                        <Text textStyle="xs" color="fg.muted">
                          Temperature
                        </Text>
                        <Text textStyle="xs" fontFamily="mono" color="fg.emphasized">
                          {temperature}
                        </Text>
                      </HStack>
                      <Slider.Root
                        size="sm"
                        min={0}
                        max={1.5}
                        step={0.05}
                        value={[temperature]}
                        onValueChange={function onSlide(e) {
                          setTemperature(e.value[0])
                        }}
                        colorPalette="ruby"
                      >
                        <Slider.Control>
                          <Slider.Track>
                            <Slider.Range />
                          </Slider.Track>
                          <Slider.Thumb index={0} />
                        </Slider.Control>
                      </Slider.Root>
                    </VStack>

                    <VStack align="stretch" gap="1" w="8rem">
                      <Text textStyle="xs" color="fg.muted">
                        Max Tokens
                      </Text>
                      <Input
                        size="sm"
                        type="number"
                        value={maxTokens}
                        onChange={function onMaxTok(e) {
                          setMaxTokens(parseInt(e.target.value, 10) || 1024)
                        }}
                      />
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer p="0" mt="6">
            <HStack justify="flex-end" gap="3" w="full">
              <Button size="sm" variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                colorPalette="ruby"
                variant="solid"
                loading={isSaving}
              >
                {isEditing ? 'Save Changes' : 'Create Prompt'}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
