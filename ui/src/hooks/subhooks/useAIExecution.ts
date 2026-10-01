import { useAtom } from 'jotai'
import { aiAnalysisStateAtom } from '@/state/atoms'
import { AIService } from '@/lib/bindings'
import { useTranslation } from '@/i18n'

export function useAIExecution() {
  const [, setAiState] = useAtom(aiAnalysisStateAtom)
  const { t } = useTranslation()

  async function executeAnalysis(
    text: string,
    actionType: 'explain' | 'summarize' | 'vocabulary'
  ) {
    if (!text || text.trim() === '') {
      setAiState({
        loading: false,
        result: null,
        action: actionType,
        error: t.aiPanel.emptyParagraphError,
      })
      return
    }

    setAiState({
      loading: true,
      result: null,
      action: actionType,
      error: null,
    })

    try {
      const response = await AIService.analyzeParagraph(text, actionType)
      setAiState({
        loading: false,
        result: response,
        action: actionType,
        error: null,
      })
    } catch (error: any) {
      console.error('AI Analysis failed:', error)
      setAiState({
        loading: false,
        result: null,
        action: actionType,
        error: error?.message || t.aiPanel.missingKeyError,
      })
    }
  }

  return {
    executeAnalysis,
  }
}
