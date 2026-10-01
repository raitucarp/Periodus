import React from 'react'
import { match } from 'ts-pattern'
import { motion, AnimatePresence } from 'motion/react'
import { useAtom } from 'jotai'
import { promptsListAtom } from '@/state/atoms'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { useTranslation } from '@/i18n'
import { AIPanelHeader } from './AIPanelHeader'
import { AIActionButtons } from './AIActionButtons'
import { AILoadingState } from './AILoadingState'
import { AIErrorState } from './AIErrorState'
import { AIResultState } from './AIResultState'
import { AIEmptyState } from './AIEmptyState'
import { AIPanelBodyContainer } from './AIPanelBodyContainer'
import { AIPanelLayout } from './AIPanelLayout'

export interface AIAnalysisPanelProps {
  paragraphText: string
  onOpenSettings: () => void
}

export function AIAnalysisPanel({ paragraphText, onOpenSettings }: AIAnalysisPanelProps) {
  const { isLoading, analysisResult, activeAction, errorMessage, analyzeParagraph } = useAIAnalysis()
  const [prompts] = useAtom(promptsListAtom)
  const { t, format } = useTranslation()

  function handleActionClick(promptId: string) {
    analyzeParagraph(paragraphText, promptId)
  }

  function handleSettingsClick() {
    onOpenSettings()
  }

  const activePrompt = prompts.find(function matchPrompt(p) {
    return p.id === activeAction
  })

  const actionName = activePrompt ? activePrompt.name : activeAction || ''
  const resultBadgeText = format(t.aiPanel.resultBadge, { action: actionName })

  type ViewStatus = 'loading' | 'error' | 'result' | 'empty'
  const currentStatus: ViewStatus = match({ isLoading, errorMessage, analysisResult })
    .with({ isLoading: true }, function toLoading() {
      return 'loading' as const
    })
    .with({ errorMessage: errorMessage || null }, function toError() {
      return 'error' as const
    })
    .with({ analysisResult: analysisResult || null }, function toResult() {
      return 'result' as const
    })
    .otherwise(function toEmpty() {
      return 'empty' as const
    })

  const bodyContent = match(currentStatus)
    .with('loading', function renderLoading() {
      return <AILoadingState label={t.aiPanel.analyzingState} />
    })
    .with('error', function renderError() {
      return (
        <AIErrorState
          problemHeading={t.aiPanel.problemHeading}
          errorMessage={errorMessage || ''}
          settingsLabel={t.aiPanel.openSettingsBtn}
          onOpenSettings={handleSettingsClick}
        />
      )
    })
    .with('result', function renderResult() {
      return (
        <AIResultState
          badgeText={resultBadgeText}
          resultText={analysisResult || ''}
        />
      )
    })
    .with('empty', function renderEmpty() {
      return (
        <AIEmptyState
          title={t.aiPanel.emptyTitle}
          description={t.aiPanel.emptyDescription}
        />
      )
    })
    .exhaustive()

  return (
    <AIPanelLayout>
      <AIPanelHeader
        heading={t.aiPanel.heading}
        badge={t.aiPanel.badge}
      />
      <AIActionButtons
        prompts={prompts}
        activeAction={activeAction}
        isLoading={isLoading}
        onActionClick={handleActionClick}
      />
      <AIPanelBodyContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStatus}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {bodyContent}
          </motion.div>
        </AnimatePresence>
      </AIPanelBodyContainer>
    </AIPanelLayout>
  )
}
