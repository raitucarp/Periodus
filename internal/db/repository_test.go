package db

import (
	"context"
	"path/filepath"
	"testing"
)

func TestRepositoryOperations(t *testing.T) {
	tempDir := t.TempDir()
	dbPath := filepath.Join(tempDir, "test_periodus.db")

	repo, err := NewRepository(dbPath)
	if err != nil {
		t.Fatalf("failed to create repo: %v", err)
	}
	defer repo.Close()

	// 1. Test sqlite-vec extension loaded
	vecVer, err := repo.VecVersion()
	if err != nil {
		t.Fatalf("failed to get sqlite-vec version: %v", err)
	}
	t.Logf("sqlite-vec version: %s", vecVer)
	if vecVer == "" {
		t.Errorf("expected non-empty sqlite-vec version")
	}

	// 2. Test Save Book
	book := &Book{
		ID:              "test_b1",
		Title:           "Siti Nurbaya",
		Author:          "Marah Rusli",
		Description:     "Kasih tak sampai",
		Language:        "id",
		TotalChapters:   3,
		TotalParagraphs: 15,
	}
	if err := repo.SaveBook(book); err != nil {
		t.Fatalf("failed to save book: %v", err)
	}

	// 3. Test Get Book
	fetched, err := repo.GetBookByID("test_b1")
	if err != nil {
		t.Fatalf("failed to get book: %v", err)
	}
	if fetched.Title != "Siti Nurbaya" || fetched.Author != "Marah Rusli" {
		t.Errorf("book content mismatch: %+v", fetched)
	}

	// 4. Test Progress
	if err := repo.SaveProgress("test_b1", 2, 4, 45.5); err != nil {
		t.Fatalf("failed to save progress: %v", err)
	}
	progress, err := repo.GetProgress("test_b1")
	if err != nil {
		t.Fatalf("failed to get progress: %v", err)
	}
	if progress.CurrentChapterIndex != 2 || progress.CurrentParagraphIndex != 4 {
		t.Errorf("progress mismatch: %+v", progress)
	}

	// 5. Test Settings
	if err := repo.SetSetting("gemini_api_key", "test_key_123"); err != nil {
		t.Fatalf("failed to set setting: %v", err)
	}
	val, err := repo.GetSetting("gemini_api_key")
	if err != nil {
		t.Fatalf("failed to get setting: %v", err)
	}
	if val != "test_key_123" {
		t.Errorf("setting value mismatch: %s", val)
	}

	// 6. Test Paragraphs and Vector Embeddings
	ctx := context.Background()
	paragraphs := []Paragraph{
		{
			ID:             "p_1",
			BookID:         "test_b1",
			ChapterIndex:   1,
			ParagraphIndex: 1,
			FilePath:       "/dummy/p1.txt",
			ContentPreview: "Hari itu cuaca sangat cerah di kota Padang.",
		},
		{
			ID:             "p_2",
			BookID:         "test_b1",
			ChapterIndex:   1,
			ParagraphIndex: 2,
			FilePath:       "/dummy/p2.txt",
			ContentPreview: "Samsulbahri berjalan menyusuri pantai bersama Siti Nurbaya.",
		},
	}
	if err := repo.SaveParagraphs(paragraphs); err != nil {
		t.Fatalf("failed to save paragraphs: %v", err)
	}

	// Save embeddings: p1 vector [1.0, 0.0, 0.0], p2 vector [0.0, 1.0, 0.0]
	emb1 := []float32{1.0, 0.0, 0.0}
	emb2 := []float32{0.0, 1.0, 0.0}

	if err := repo.SaveParagraphEmbedding(ctx, "emb_1", "p_1", "test_b1", emb1, "test-model"); err != nil {
		t.Fatalf("failed to save embedding 1: %v", err)
	}
	if err := repo.SaveParagraphEmbedding(ctx, "emb_2", "p_2", "test_b1", emb2, "test-model"); err != nil {
		t.Fatalf("failed to save embedding 2: %v", err)
	}

	// Search similar to [0.95, 0.05, 0.0] -> should rank p_1 first
	queryVec := []float32{0.95, 0.05, 0.0}
	results, err := repo.SearchSimilarParagraphs(ctx, "test_b1", queryVec, 2)
	if err != nil {
		t.Fatalf("failed to search similar paragraphs: %v", err)
	}
	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %d", len(results))
	}
	if results[0].ID != "p_1" {
		t.Errorf("expected top match to be p_1, got %s", results[0].ID)
	}
}
