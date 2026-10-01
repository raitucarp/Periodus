package db

import (
	"context"
)

func (r *Repository) SaveChapters(chapters []Chapter) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	qtx := r.queries.WithTx(tx)
	ctx := context.Background()

	for _, ch := range chapters {
		err := qtx.UpsertChapter(ctx, UpsertChapterParams{
			ID:             ch.ID,
			BookID:         ch.BookID,
			ChapterIndex:   ch.ChapterIndex,
			Title:          ch.Title,
			FilePath:       ch.FilePath,
			ParagraphCount: ch.ParagraphCount,
		})
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) GetChaptersByBookID(bookID string) ([]Chapter, error) {
	return r.queries.ListChaptersByBookID(context.Background(), bookID)
}
