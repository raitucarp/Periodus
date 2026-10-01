package service

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/llm"
)

type AIService struct {
	mu             sync.RWMutex
	repo           *db.Repository
	llmClient      *llm.Client
	legacyProvider llm.Provider
}

func NewAIService(repo *db.Repository, legacyProvider llm.Provider) *AIService {
	return &AIService{
		repo:           repo,
		llmClient:      llm.NewClient(),
		legacyProvider: legacyProvider,
	}
}

func SetLegacyProvider(s *AIService, p llm.Provider) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.legacyProvider = p
}

// AnalyzeParagraph keeps backward-compatibility, running analysis with a prompt ID
func (s *AIService) AnalyzeParagraph(text string, promptID string) (string, error) {
	return s.AnalyzeParagraphWithBook(text, promptID, "")
}

// AnalyzeParagraphWithBook executes analysis for a specific prompt ID and book context
func (s *AIService) AnalyzeParagraphWithBook(text string, promptID string, bookID string) (string, error) {
	if strings.TrimSpace(text) == "" {
		return "", fmt.Errorf("paragraph text cannot be empty")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	if s.repo == nil {
		return "", fmt.Errorf("repository is not initialized")
	}

	// 1. Resolve prompt directly from database
	prompt, err := s.repo.GetPromptByID(ctx, promptID)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve prompt '%s': %w", promptID, err)
	}

	// Fallback to first available prompt for book scope if specific ID not found directly
	if prompt == nil {
		prompts, listErr := s.repo.GetPrompts(ctx, bookID)
		if listErr == nil && len(prompts) > 0 {
			for i := range prompts {
				if prompts[i].ID == promptID {
					prompt = &prompts[i]
					break
				}
			}
			if prompt == nil {
				prompt = &prompts[0]
			}
		}
	}

	if prompt == nil {
		return "", fmt.Errorf("no prompt configuration found for '%s'", promptID)
	}

	// 2. Interpolate user prompt template variables
	finalPrompt := prompt.UserPrompt
	finalPrompt = strings.ReplaceAll(finalPrompt, "{{text}}", text)

	if bookID != "" {
		if book, bookErr := s.repo.GetBookByID(bookID); bookErr == nil && book != nil {
			finalPrompt = strings.ReplaceAll(finalPrompt, "{{book_title}}", book.Title)
			finalPrompt = strings.ReplaceAll(finalPrompt, "{{author}}", book.Author)
			finalPrompt = strings.ReplaceAll(finalPrompt, "{{language}}", book.Language)
		}
	}

	if !strings.Contains(prompt.UserPrompt, "{{text}}") {
		finalPrompt = fmt.Sprintf("%s\n\n\"\"\"\n%s\n\"\"\"", prompt.UserPrompt, text)
	}

	// 3. Resolve AI model settings
	var cfg db.ModelConfig
	aiSettings, err := s.repo.GetAISettings(ctx, bookID)
	if err == nil && aiSettings != nil {
		cfg = aiSettings.Chat
	}

	// Apply prompt-level overrides if specified
	if prompt.Provider != "" {
		cfg.Provider = prompt.Provider
	}
	if prompt.Model != "" {
		cfg.Model = prompt.Model
	}
	if prompt.Temperature > 0 {
		cfg.Temperature = prompt.Temperature
	}
	if prompt.MaxTokens > 0 {
		cfg.MaxTokens = int(prompt.MaxTokens)
	}

	// Fallback to legacy provider if API key is not configured in modern settings
	if cfg.ApiKey == "" && s.legacyProvider != nil {
		return s.legacyProvider.Analyze(ctx, text, llm.AnalysisType(prompt.ID))
	}

	return s.llmClient.GenerateChat(ctx, cfg, prompt.SystemPrompt, finalPrompt)
}
