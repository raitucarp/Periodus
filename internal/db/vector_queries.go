package db

import (
	"context"
	"fmt"
)

// SaveParagraphEmbedding stores a float32 vector embedding for a paragraph using sqlite-vec serialization
func (r *Repository) SaveParagraphEmbedding(ctx context.Context, id, paragraphID, bookID string, embedding []float32, model string) error {
	bytes, err := SerializeEmbedding(embedding)
	if err != nil {
		return fmt.Errorf("failed to serialize embedding: %w", err)
	}

	return r.queries.UpsertParagraphEmbedding(ctx, UpsertParagraphEmbeddingParams{
		ID:          id,
		ParagraphID: paragraphID,
		BookID:      bookID,
		Embedding:   bytes,
		Dimensions:  int64(len(embedding)),
		Model:       model,
	})
}

// GetParagraphEmbedding retrieves the embedding record for a paragraph
func (r *Repository) GetParagraphEmbedding(ctx context.Context, paragraphID string) (*ParagraphEmbedding, error) {
	emb, err := r.queries.GetParagraphEmbedding(ctx, paragraphID)
	if err != nil {
		return nil, err
	}
	return &emb, nil
}

// ListParagraphEmbeddingsByBook retrieves all embeddings for a book
func (r *Repository) ListParagraphEmbeddingsByBook(ctx context.Context, bookID string) ([]ParagraphEmbedding, error) {
	return r.queries.ListParagraphEmbeddingsByBook(ctx, bookID)
}

// DeleteEmbeddingsByBookID removes all embeddings associated with a book
func (r *Repository) DeleteEmbeddingsByBookID(ctx context.Context, bookID string) error {
	return r.queries.DeleteEmbeddingsByBookID(ctx, bookID)
}

// SearchSimilarParagraphs executes a vector similarity search using sqlite-vec's vec_distance_cosine function
func (r *Repository) SearchSimilarParagraphs(ctx context.Context, bookID string, queryEmbedding []float32, limit int) ([]Paragraph, error) {
	queryBytes, err := SerializeEmbedding(queryEmbedding)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize query embedding: %w", err)
	}

	query := `
		SELECT p.id, p.book_id, p.chapter_index, p.paragraph_index, p.file_path, p.content_preview, p.created_at
		FROM paragraph_embeddings e
		JOIN paragraphs p ON e.paragraph_id = p.id
		WHERE e.book_id = ?
		ORDER BY vec_distance_cosine(e.embedding, ?) ASC
		LIMIT ?
	`
	rows, err := r.db.QueryContext(ctx, query, bookID, queryBytes, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []Paragraph
	for rows.Next() {
		var p Paragraph
		if err := rows.Scan(
			&p.ID,
			&p.BookID,
			&p.ChapterIndex,
			&p.ParagraphIndex,
			&p.FilePath,
			&p.ContentPreview,
			&p.CreatedAt,
		); err != nil {
			return nil, err
		}
		results = append(results, p)
	}
	return results, nil
}
