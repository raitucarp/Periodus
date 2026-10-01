package service

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/raitucarp/periodus/internal/llm"
)

type AIService struct {
	mu       sync.RWMutex
	provider llm.Provider
}

func NewAIService(provider llm.Provider) *AIService {
	return &AIService{
		provider: provider,
	}
}

func (s *AIService) SetProvider(p llm.Provider) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.provider = p
}

func (s *AIService) AnalyzeParagraph(text string, analysisType string) (string, error) {
	s.mu.RLock()
	provider := s.provider
	s.mu.RUnlock()

	if provider == nil {
		return "", fmt.Errorf("provider LLM belum dikonfigurasi. Silakan atur Gemini API Key di Pengaturan")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 45*time.Second)
	defer cancel()

	return provider.Analyze(ctx, text, llm.AnalysisType(analysisType))
}
