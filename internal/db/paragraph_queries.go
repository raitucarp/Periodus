package db

import (
	"context"
)

func (r *Repository) SaveParagraphs(paragraphs []Paragraph) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	qtx := r.queries.WithTx(tx)
	ctx := context.Background()

	for _, p := range paragraphs {
		err := qtx.UpsertParagraph(ctx, UpsertParagraphParams{
			ID:             p.ID,
			BookID:         p.BookID,
			ChapterIndex:   p.ChapterIndex,
			ParagraphIndex: p.ParagraphIndex,
			FilePath:       p.FilePath,
			ContentPreview: p.ContentPreview,
		})
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) GetParagraphsByChapter(bookID string, chapterIndex int64) ([]Paragraph, error) {
	return r.queries.ListParagraphsByChapter(context.Background(), ListParagraphsByChapterParams{
		BookID:       bookID,
		ChapterIndex: chapterIndex,
	})
}

func (r *Repository) GetParagraphByID(id string) (*Paragraph, error) {
	p, err := r.queries.GetParagraphByID(context.Background(), id)
	if err != nil {
		return nil, err
	}
	return &p, nil
}
