import { useAtom } from 'jotai'
import { aiAnalysisStateAtom, initialAIState } from '@/state/atoms'
import { useAIExecution } from './subhooks/useAIExecution'

export function useAIAnalysis() {
  const [aiState, setAiState] = useAtom(aiAnalysisStateAtom)
  const { executeAnalysis } = useAIExecution()

  function resetAnalysis() {
    setAiState(initialAIState)
  }

  return {
    isLoading: aiState.loading,
    analysisResult: aiState.result,
    activeAction: aiState.action,
    errorMessage: aiState.error,
    analyzeParagraph: executeAnalysis,
    resetAnalysis,
  }
}
