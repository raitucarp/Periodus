package llm

import "context"

type AnalysisType string

const (
	AnalysisTypeExplain    AnalysisType = "explain"
	AnalysisTypeSummarize  AnalysisType = "summarize"
	AnalysisTypeVocabulary AnalysisType = "vocabulary"
)

type Provider interface {
	Name() string
	Analyze(ctx context.Context, text string, aType AnalysisType) (string, error)
}
