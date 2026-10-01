package llm

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/firebase/genkit/go/ai"
	"github.com/firebase/genkit/go/genkit"
	"github.com/firebase/genkit/go/plugins/googlegenai"
)

type GenkitProvider struct {
	gk    *genkit.Genkit
	model string
}

func NewGenkitProvider(apiKey string, modelName string) (*GenkitProvider, error) {
	if apiKey != "" {
		_ = os.Setenv("GEMINI_API_KEY", apiKey)
	}

	if modelName == "" {
		modelName = "googleai/gemini-2.5-flash"
	}

	ctx := context.Background()
	gk := genkit.Init(ctx,
		genkit.WithPlugins(&googlegenai.GoogleAI{}),
		genkit.WithDefaultModel(modelName),
	)

	return &GenkitProvider{
		gk:    gk,
		model: modelName,
	}, nil
}

func (p *GenkitProvider) Name() string {
	return "Genkit (Google Gemini)"
}

func (p *GenkitProvider) Analyze(ctx context.Context, text string, aType AnalysisType) (string, error) {
	if strings.TrimSpace(text) == "" {
		return "", fmt.Errorf("teks paragraf tidak boleh kosong")
	}

	var promptText string
	switch aType {
	case AnalysisTypeSummarize:
		promptText = fmt.Sprintf("Berikan intisari/ringkasan 1-2 kalimat dari paragraf berikut:\n\n\"\"\"\n%s\n\"\"\"", text)
	case AnalysisTypeVocabulary:
		promptText = fmt.Sprintf("Identifikasi kata penting, istilah asing, atau ungkapan bermakna dalam paragraf berikut beserta artinya secara ringkas:\n\n\"\"\"\n%s\n\"\"\"", text)
	case AnalysisTypeExplain:
		fallthrough
	default:
		promptText = fmt.Sprintf("Jelaskan makna, konteks, dan nuansa dari paragraf berikut dengan bahasa yang jelas dan ramah pembaca:\n\n\"\"\"\n%s\n\"\"\"", text)
	}

	resp, err := genkit.Generate(ctx, p.gk,
		ai.WithModelName(p.model),
		ai.WithPrompt(promptText),
	)
	if err != nil {
		return "", fmt.Errorf("gagal menganalisis via Genkit: %w", err)
	}

	if resp == nil || resp.Message == nil {
		return "", fmt.Errorf("tidak ada respons yang diterima dari LLM")
	}

	var sb strings.Builder
	for _, part := range resp.Message.Content {
		if part.Kind == ai.PartText {
			sb.WriteString(part.Text)
		}
	}

	return strings.TrimSpace(sb.String()), nil
}
