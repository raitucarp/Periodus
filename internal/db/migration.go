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

	if err := migrateNewReadingTables(db); err != nil {
		return fmt.Errorf("migrate reading tables: %w", err)
	}

	return nil
}

func migrateNewReadingTables(db *sql.DB) error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS paragraph_stats (
			book_id TEXT NOT NULL,
			chapter_index INTEGER NOT NULL,
			paragraph_index INTEGER NOT NULL,
			visit_count INTEGER NOT NULL DEFAULT 0,
			is_skipped INTEGER NOT NULL DEFAULT 0,
			custom_font_family TEXT NOT NULL DEFAULT '',
			custom_font_size REAL NOT NULL DEFAULT 0,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (book_id, chapter_index, paragraph_index),
			FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS sentence_annotations (
			sentence_hash TEXT PRIMARY KEY,
			book_id TEXT NOT NULL,
			chapter_index INTEGER NOT NULL,
			paragraph_index INTEGER NOT NULL,
			is_bookmarked INTEGER NOT NULL DEFAULT 0,
			highlight_color TEXT NOT NULL DEFAULT '',
			upvotes_count INTEGER NOT NULL DEFAULT 0,
			emoji_reactions TEXT NOT NULL DEFAULT '[]',
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS sentence_comments (
			id TEXT PRIMARY KEY,
			sentence_hash TEXT NOT NULL,
			book_id TEXT NOT NULL,
			content TEXT NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
		);`,
		`CREATE INDEX IF NOT EXISTS idx_paragraph_stats_lookup ON paragraph_stats(book_id, chapter_index);`,
		`CREATE INDEX IF NOT EXISTS idx_sentence_annotations_pos ON sentence_annotations(book_id, chapter_index, paragraph_index);`,
		`CREATE INDEX IF NOT EXISTS idx_sentence_comments_hash ON sentence_comments(sentence_hash);`,
	}

	for _, q := range queries {
		if _, err := db.Exec(q); err != nil {
			return fmt.Errorf("execute table migration: %w", err)
		}
	}

	// Add missing columns to existing paragraph_stats if already created
	newCols := []struct {
		name string
		def  string
	}{
		{"is_bookmarked", "INTEGER NOT NULL DEFAULT 0"},
		{"upvotes_count", "INTEGER NOT NULL DEFAULT 0"},
		{"emoji_reactions", "TEXT NOT NULL DEFAULT '[]'"},
	}

	rows, err := db.Query("PRAGMA table_info(paragraph_stats);")
	if err == nil {
		defer rows.Close()
		existingCols := make(map[string]bool)
		for rows.Next() {
			var cid int
			var name, typ string
			var notnull, pk int
			var dflt sql.NullString
			if err := rows.Scan(&cid, &name, &typ, &notnull, &dflt, &pk); err == nil {
				existingCols[name] = true
			}
		}
		for _, col := range newCols {
			if !existingCols[col.name] {
				query := fmt.Sprintf("ALTER TABLE paragraph_stats ADD COLUMN %s %s;", col.name, col.def)
				_, _ = db.Exec(query)
			}
		}
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
