package db

import (
	"context"
	"encoding/json"
	"os"
)

func defaultAISettings(scope string) AISettings {
	return AISettings{
		Scope:     scope,
		UseGlobal: true,
		Chat: ModelConfig{
			Provider:    "gemini",
			Model:       "gemini-2.5-flash",
			ApiKey:      "",
			BaseUrl:     "",
			Temperature: 0.7,
			MaxTokens:   2048,
		},
		Embedding: EmbeddingConfig{
			Provider:   "gemini",
			Model:      "text-embedding-004",
			ApiKey:     "",
			BaseUrl:    "",
			Dimensions: 768,
		},
		Vision: VisionConfig{
			Provider: "gemini",
			Model:    "gemini-2.5-flash",
			ApiKey:   "",
			BaseUrl:  "",
		},
	}
}

func defaultReadingSettings(scope string) ReadingSettings {
	return ReadingSettings{
		Scope:      scope,
		FontFamily: "Literata",
		FontSize:   18,
		LineHeight: "reading",
		MaxWidth:   "800px",
		TextAlign:  "left",
	}
}

// GetAISettings retrieves AI settings for a book, or falls back to global settings
func (r *Repository) GetAISettings(ctx context.Context, bookID string) (*AISettings, error) {
	if bookID != "" {
		val, err := r.GetSetting("ai_settings:book_" + bookID)
		if err == nil && val != "" {
			var bookCfg AISettings
			if jsonErr := json.Unmarshal([]byte(val), &bookCfg); jsonErr == nil {
				if !bookCfg.UseGlobal {
					return &bookCfg, nil
				}
			}
		}
	}

	val, err := r.GetSetting("ai_settings:global")
	if err == nil && val != "" {
		var globalCfg AISettings
		if jsonErr := json.Unmarshal([]byte(val), &globalCfg); jsonErr == nil {
			return &globalCfg, nil
		}
	}

	// Fallback to legacy gemini_api_key or env var
	defaults := defaultAISettings("global")
	legacyKey, _ := r.GetSetting("gemini_api_key")
	if legacyKey == "" {
		legacyKey = os.Getenv("GEMINI_API_KEY")
	}
	defaults.Chat.ApiKey = legacyKey
	defaults.Embedding.ApiKey = legacyKey
	defaults.Vision.ApiKey = legacyKey

	return &defaults, nil
}

// SaveAISettings stores AI configuration either for global or a specific book
func (r *Repository) SaveAISettings(ctx context.Context, settings AISettings) error {
	bytes, err := json.Marshal(settings)
	if err != nil {
		return err
	}

	key := "ai_settings:global"
	if settings.Scope != "" && settings.Scope != "global" {
		key = "ai_settings:book_" + settings.Scope
	}

	if err := r.SetSetting(key, string(bytes)); err != nil {
		return err
	}

	// Sync legacy key if global
	if (settings.Scope == "" || settings.Scope == "global") && settings.Chat.Provider == "gemini" && settings.Chat.ApiKey != "" {
		_ = r.SetSetting("gemini_api_key", settings.Chat.ApiKey)
		_ = os.Setenv("GEMINI_API_KEY", settings.Chat.ApiKey)
	}

	return nil
}

// GetReadingSettings retrieves reading display settings
func (r *Repository) GetReadingSettings(ctx context.Context, bookID string) (*ReadingSettings, error) {
	if bookID != "" {
		val, err := r.GetSetting("reading_settings:book_" + bookID)
		if err == nil && val != "" {
			var bookCfg ReadingSettings
			if jsonErr := json.Unmarshal([]byte(val), &bookCfg); jsonErr == nil {
				return &bookCfg, nil
			}
		}
	}

	val, err := r.GetSetting("reading_settings:global")
	if err == nil && val != "" {
		var globalCfg ReadingSettings
		if jsonErr := json.Unmarshal([]byte(val), &globalCfg); jsonErr == nil {
			return &globalCfg, nil
		}
	}

	defaults := defaultReadingSettings("global")
	return &defaults, nil
}

// SaveReadingSettings stores reading display settings
func (r *Repository) SaveReadingSettings(ctx context.Context, settings ReadingSettings) error {
	bytes, err := json.Marshal(settings)
	if err != nil {
		return err
	}

	key := "reading_settings:global"
	if settings.Scope != "" && settings.Scope != "global" {
		key = "reading_settings:book_" + settings.Scope
	}

	return r.SetSetting(key, string(bytes))
}
