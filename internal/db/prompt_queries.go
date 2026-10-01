package db

import (
	"context"
	"database/sql"
)

// SeedDefaultPrompts executes the sqlc-generated query to seed English default prompts
func (r *Repository) SeedDefaultPrompts(ctx context.Context) error {
	return r.queries.SeedDefaultPrompts(ctx)
}

// GetPrompts retrieves all prompts applicable for a given book using sqlc-generated query
func (r *Repository) GetPrompts(ctx context.Context, bookID string) ([]Prompt, error) {
	return r.queries.ListPrompts(ctx, bookID)
}

// GetPromptByID retrieves a single prompt by its unique identifier using sqlc-generated query
func (r *Repository) GetPromptByID(ctx context.Context, id string) (*Prompt, error) {
	p, err := r.queries.GetPromptByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

// SavePrompt creates or updates a prompt using sqlc-generated query
func (r *Repository) SavePrompt(ctx context.Context, p Prompt) error {
	return r.queries.UpsertPrompt(ctx, UpsertPromptParams{
		ID:           p.ID,
		Name:         p.Name,
		Description:  p.Description,
		Icon:         p.Icon,
		ColorPalette: p.ColorPalette,
		SystemPrompt: p.SystemPrompt,
		UserPrompt:   p.UserPrompt,
		Provider:     p.Provider,
		Model:        p.Model,
		Temperature:  p.Temperature,
		MaxTokens:    p.MaxTokens,
		IsBuiltin:    p.IsBuiltin,
		IsEnabled:    p.IsEnabled,
		SortOrder:    p.SortOrder,
		Scope:        p.Scope,
		BookID:       p.BookID,
	})
}

// DeletePrompt removes a prompt using sqlc-generated query
func (r *Repository) DeletePrompt(ctx context.Context, id string) error {
	return r.queries.DeletePrompt(ctx, id)
}

// ResetDefaultPrompts restores the built-in English default prompts using sqlc-generated query
func (r *Repository) ResetDefaultPrompts(ctx context.Context) error {
	return r.queries.ResetDefaultPrompts(ctx)
}
