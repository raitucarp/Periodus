package db

import (
	"context"
	"database/sql"
	_ "embed"

	vec "github.com/asg017/sqlite-vec-go-bindings/ncruces"
	"github.com/ncruces/go-sqlite3"
	_ "github.com/ncruces/go-sqlite3/driver"
	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/tetratelabs/wazero/experimental"
)

func init() {
	sqlite3.RuntimeConfig = wazero.NewRuntimeConfig().WithCoreFeatures(api.CoreFeaturesV2 | experimental.CoreFeaturesThreads)
}

//go:embed schema.sql
var schemaSQL string

type Repository struct {
	db      *sql.DB
	queries *Queries
}

func NewRepository(dbPath string) (*Repository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// Enable WAL mode & foreign keys for performance and data integrity
	if _, err := db.Exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;"); err != nil {
		db.Close()
		return nil, err
	}

	if _, err := db.Exec(schemaSQL); err != nil {
		db.Close()
		return nil, err
	}

	if err := migrateSchema(db); err != nil {
		db.Close()
		return nil, err
	}

	repo := &Repository{
		db:      db,
		queries: New(db),
	}

	if err := repo.SeedDefaultPrompts(context.Background()); err != nil {
		db.Close()
		return nil, err
	}

	return repo, nil
}

func (r *Repository) Close() error {
	return r.db.Close()
}

func (r *Repository) DB() *sql.DB {
	return r.db
}

func (r *Repository) Queries() *Queries {
	return r.queries
}

// VecVersion returns the sqlite-vec extension version, verifying vector support is active
func (r *Repository) VecVersion() (string, error) {
	var version string
	err := r.db.QueryRow("SELECT vec_version()").Scan(&version)
	if err != nil {
		return "", err
	}
	return version, nil
}

// SerializeEmbedding serializes a float32 slice into compact binary vector format
func SerializeEmbedding(embedding []float32) ([]byte, error) {
	return vec.SerializeFloat32(embedding)
}
