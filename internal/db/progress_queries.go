package db

import (
	"context"
)

func (r *Repository) SaveProgress(bookID string, chapterIndex int64, paragraphIndex int64, percent float64) error {
	return r.queries.UpsertProgress(context.Background(), UpsertProgressParams{
		BookID:                bookID,
		CurrentChapterIndex:   chapterIndex,
		CurrentParagraphIndex: paragraphIndex,
		PercentComplete:       percent,
	})
}

func (r *Repository) GetProgress(bookID string) (*ReadingProgress, error) {
	p, err := r.queries.GetProgress(context.Background(), bookID)
	if err != nil {
		return nil, err
	}
	return &p, nil
}
