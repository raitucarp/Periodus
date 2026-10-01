package service

import (
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
