package db

import (
	"context"
)

func (r *Repository) GetAllBooks() ([]ListBooksRow, error) {
	return r.queries.ListBooks(context.Background())
}

func (r *Repository) GetBookByID(id string) (*GetBookByIDRow, error) {
	b, err := r.queries.GetBookByID(context.Background(), id)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *Repository) SaveBook(b *Book) error {
	return r.queries.UpsertBook(context.Background(), UpsertBookParams{
		ID:              b.ID,
		Title:           b.Title,
		Author:          b.Author,
		Description:     b.Description,
		Publisher:       b.Publisher,
		Language:        b.Language,
		CoverPath:       b.CoverPath,
		SourceFilePath:  b.SourceFilePath,
		TotalChapters:   b.TotalChapters,
		TotalParagraphs: b.TotalParagraphs,
	})
}

func (r *Repository) DeleteBook(id string) error {
	return r.queries.DeleteBook(context.Background(), id)
}
