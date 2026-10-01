package db

import (
	"database/sql"
	"fmt"
)

// migrateSchema inspects existing SQLite tables and performs additive migrations
// for schema evolution (e.g. adding missing columns to existing tables).
func migrateSchema(db *sql.DB) error {
	if err := migratePromptsTable(db); err != nil {
		return fmt.Errorf("migrate prompts table: %w", err)
	}

	return nil
}

func migratePromptsTable(db *sql.DB) error {
	rows, err := db.Query("PRAGMA table_info(prompts);")
	if err != nil {
		return err
	}
	defer rows.Close()

	existingCols := make(map[string]bool)
	for rows.Next() {
		var cid int
		var name, typ string
		var notnull, pk int
		var dflt sql.NullString
		if err := rows.Scan(&cid, &name, &typ, &notnull, &dflt, &pk); err != nil {
			return err
		}
		existingCols[name] = true
	}

	// If table doesn't exist yet, schema.sql will create it
	if len(existingCols) == 0 {
		return nil
	}

	columnsToAdd := []struct {
		name string
		def  string
	}{
		{"description", "TEXT NOT NULL DEFAULT ''"},
		{"icon", "TEXT NOT NULL DEFAULT 'Sparkles'"},
		{"color_palette", "TEXT NOT NULL DEFAULT 'ruby'"},
		{"system_prompt", "TEXT NOT NULL DEFAULT ''"},
		{"user_prompt", "TEXT NOT NULL DEFAULT ''"},
		{"provider", "TEXT NOT NULL DEFAULT ''"},
		{"model", "TEXT NOT NULL DEFAULT ''"},
		{"temperature", "REAL NOT NULL DEFAULT 0.7"},
		{"max_tokens", "INTEGER NOT NULL DEFAULT 2048"},
		{"is_builtin", "INTEGER NOT NULL DEFAULT 0"},
		{"is_enabled", "INTEGER NOT NULL DEFAULT 1"},
		{"sort_order", "INTEGER NOT NULL DEFAULT 0"},
		{"scope", "TEXT NOT NULL DEFAULT 'global'"},
		{"book_id", "TEXT NOT NULL DEFAULT ''"},
		{"created_at", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"},
		{"updated_at", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"},
	}

	for _, col := range columnsToAdd {
		if !existingCols[col.name] {
			query := fmt.Sprintf("ALTER TABLE prompts ADD COLUMN %s %s;", col.name, col.def)
			if _, err := db.Exec(query); err != nil {
				return fmt.Errorf("failed to add column %s to prompts: %w", col.name, err)
			}
		}
	}

	// Update default prompt icons & palettes if they were created before these columns existed
	_, _ = db.Exec(`
		UPDATE prompts SET icon = 'Sparkles', color_palette = 'ruby' WHERE id = 'explain_nuance' AND (icon = '' OR icon = 'Sparkles');
		UPDATE prompts SET icon = 'Zap', color_palette = 'amber' WHERE id = 'quick_summary' AND (icon = '' OR icon = 'Sparkles');
		UPDATE prompts SET icon = 'BookOpen', color_palette = 'teal' WHERE id = 'vocab_idioms' AND (icon = '' OR icon = 'Sparkles');
		UPDATE prompts SET icon = 'Glasses', color_palette = 'indigo' WHERE id = 'literary_critique' AND (icon = '' OR icon = 'Sparkles');
	`)

	// Ensure prompt index exists
	_, _ = db.Exec("CREATE INDEX IF NOT EXISTS idx_prompts_scope ON prompts(scope, book_id, sort_order);")

	return nil
}
