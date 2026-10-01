import React from 'react'
import { match } from 'ts-pattern'
import { motion, AnimatePresence } from 'motion/react'
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
  const { t, format } = useTranslation()

  function handleExplainClick() {
    analyzeParagraph(paragraphText, 'explain')
  }

  function handleSummarizeClick() {
    analyzeParagraph(paragraphText, 'summarize')
  }

  function handleVocabularyClick() {
    analyzeParagraph(paragraphText, 'vocabulary')
  }

  function handleSettingsClick() {
    onOpenSettings()
  }

  const resultBadgeText = format(t.aiPanel.resultBadge, { action: activeAction || '' })

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

  const panelLayout = (
    <AIPanelLayout>
      <AIPanelHeader
        heading={t.aiPanel.heading}
        badge={t.aiPanel.badge}
      />
      <AIActionButtons
        activeAction={activeAction}
        isLoading={isLoading}
        explainLabel={t.aiPanel.explainBtn}
        summarizeLabel={t.aiPanel.summarizeBtn}
        vocabularyLabel={t.aiPanel.vocabularyBtn}
        onExplain={handleExplainClick}
        onSummarize={handleSummarizeClick}
        onVocabulary={handleVocabularyClick}
      />
      <AIPanelBodyContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStatus}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {bodyContent}
          </motion.div>
        </AnimatePresence>
      </AIPanelBodyContainer>
    </AIPanelLayout>
  )

  return panelLayout
}
