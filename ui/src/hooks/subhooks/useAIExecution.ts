import { useAtom } from 'jotai'
import { aiAnalysisStateAtom, selectedBookIdAtom } from '@/state/atoms'
import { AIService } from '@/lib/bindings'
import { useTranslation } from '@/i18n'

export function useAIExecution() {
  const [, setAiState] = useAtom(aiAnalysisStateAtom)
  const [selectedBookId] = useAtom(selectedBookIdAtom)
  const { t } = useTranslation()

  async function executeAnalysis(
    text: string,
    actionType: string
  ) {
    if (!text || text.trim() === '') {
      setAiState({
        loading: false,
        result: null,
        action: actionType as any,
        error: t.aiPanel.emptyParagraphError,
      })
      return
    }

    setAiState({
      loading: true,
      result: null,
      action: actionType as any,
      error: null,
    })

    try {
      const response = await AIService.analyzeParagraphWithBook(text, actionType, selectedBookId || '')
      setAiState({
        loading: false,
        result: response,
        action: actionType as any,
        error: null,
      })
    } catch (error: any) {
      console.error('AI Analysis failed:', error)
      setAiState({
        loading: false,
        result: null,
        action: actionType as any,
        error: error?.message || t.aiPanel.missingKeyError,
      })
    }
  }

  return {
    executeAnalysis,
  }
}
