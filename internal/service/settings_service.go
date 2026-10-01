package service

import (
	"context"
	"os"

	"github.com/raitucarp/periodus/internal/db"
)

type SettingsService struct {
	repo      *db.Repository
	onKeySave func(key string)
}

func NewSettingsService(repo *db.Repository, onKeySave func(key string)) *SettingsService {
	return &SettingsService{
		repo:      repo,
		onKeySave: onKeySave,
	}
}

// Backward-compatible API key methods
func (s *SettingsService) GetApiKey() (string, error) {
	val, err := s.repo.GetSetting("gemini_api_key")
	if err != nil || val == "" {
		return os.Getenv("GEMINI_API_KEY"), nil
	}
	return val, nil
}

func (s *SettingsService) SaveApiKey(key string) error {
	if err := s.repo.SetSetting("gemini_api_key", key); err != nil {
		return err
	}
	_ = os.Setenv("GEMINI_API_KEY", key)
	if s.onKeySave != nil {
		s.onKeySave(key)
	}
	return nil
}

// AI Settings (Global or per-book)
func (s *SettingsService) GetAISettings(bookID string) (*db.AISettings, error) {
	return s.repo.GetAISettings(context.Background(), bookID)
}

func (s *SettingsService) SaveAISettings(settings db.AISettings) error {
	return s.repo.SaveAISettings(context.Background(), settings)
}

// Reading Settings (Global or per-book)
func (s *SettingsService) GetReadingSettings(bookID string) (*db.ReadingSettings, error) {
	return s.repo.GetReadingSettings(context.Background(), bookID)
}

func (s *SettingsService) SaveReadingSettings(settings db.ReadingSettings) error {
	return s.repo.SaveReadingSettings(context.Background(), settings)
}

// Prompts Management
func (s *SettingsService) GetPrompts(bookID string) ([]db.Prompt, error) {
	return s.repo.GetPrompts(context.Background(), bookID)
}

func (s *SettingsService) SavePrompt(p db.Prompt) error {
	return s.repo.SavePrompt(context.Background(), p)
}

func (s *SettingsService) DeletePrompt(id string) error {
	return s.repo.DeletePrompt(context.Background(), id)
}

func (s *SettingsService) ResetPrompts() error {
	return s.repo.ResetDefaultPrompts(context.Background())
}
