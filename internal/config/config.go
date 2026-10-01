package config

import (
	"os"
	"path/filepath"
)

type AppConfig struct {
	DataDir   string
	DBPath    string
	BooksDir  string
	CoversDir string
}

func GetConfig() (*AppConfig, error) {
	baseDir, err := os.UserConfigDir()
	if err != nil {
		baseDir = "."
	}

	appDir := filepath.Join(baseDir, "Periodus")
	booksDir := filepath.Join(appDir, "books")
	coversDir := filepath.Join(appDir, "covers")
	dbPath := filepath.Join(appDir, "periodus.db")

	for _, dir := range []string{appDir, booksDir, coversDir} {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, err
		}
	}

	return &AppConfig{
		DataDir:   appDir,
		DBPath:    dbPath,
		BooksDir:  booksDir,
		CoversDir: coversDir,
	}, nil
}
