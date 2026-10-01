import React from 'react'
import {
  Sparkles,
  FileText,
  Languages,
  Brain,
  BookOpen,
  HelpCircle,
  Compass,
  Search,
  MessageSquare,
  Feather,
  CheckCircle,
  Lightbulb,
} from 'lucide-react'
import { match } from 'ts-pattern'

export interface PromptIconProps {
  name: string
  size?: number | string
  className?: string
}

export function PromptIcon({ name, size = 16, className }: PromptIconProps) {
  return match(name)
    .with('Sparkles', function renderSparkles() {
      return <Sparkles size={size} className={className} />
    })
    .with('FileText', function renderFileText() {
      return <FileText size={size} className={className} />
    })
    .with('Languages', function renderLanguages() {
      return <Languages size={size} className={className} />
    })
    .with('Brain', function renderBrain() {
      return <Brain size={size} className={className} />
    })
    .with('BookOpen', function renderBookOpen() {
      return <BookOpen size={size} className={className} />
    })
    .with('HelpCircle', function renderHelpCircle() {
      return <HelpCircle size={size} className={className} />
    })
    .with('Compass', function renderCompass() {
      return <Compass size={size} className={className} />
    })
    .with('Search', function renderSearch() {
      return <Search size={size} className={className} />
    })
    .with('MessageSquare', function renderMessageSquare() {
      return <MessageSquare size={size} className={className} />
    })
    .with('Feather', function renderFeather() {
      return <Feather size={size} className={className} />
    })
    .with('CheckCircle', function renderCheckCircle() {
      return <CheckCircle size={size} className={className} />
    })
    .with('Lightbulb', function renderLightbulb() {
      return <Lightbulb size={size} className={className} />
    })
    .otherwise(function renderDefault() {
      return <Sparkles size={size} className={className} />
    })
}

export const AVAILABLE_PROMPT_ICONS = [
  'Sparkles',
  'FileText',
  'Languages',
  'Brain',
  'BookOpen',
  'HelpCircle',
  'Compass',
  'Search',
  'MessageSquare',
  'Feather',
  'CheckCircle',
  'Lightbulb',
] as const

export const AVAILABLE_COLOR_PALETTES = [
  'ruby',
  'amber',
  'teal',
  'blue',
  'purple',
  'green',
  'cyan',
  'orange',
] as const
