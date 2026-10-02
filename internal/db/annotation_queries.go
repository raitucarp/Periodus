package db

import (
	"context"
	"database/sql"
)

// IncrementParagraphVisit increments and returns the visit stats for a paragraph
func (r *Repository) IncrementParagraphVisit(ctx context.Context, bookID string, chapterIdx, paragraphIdx int64) (*ParagraphStat, error) {
	stat, err := r.queries.IncrementParagraphVisit(ctx, IncrementParagraphVisitParams{
		BookID:         bookID,
		ChapterIndex:   chapterIdx,
		ParagraphIndex: paragraphIdx,
	})
	if err != nil {
		return nil, err
	}
	return &stat, nil
}

// GetParagraphStats returns stats for a specific paragraph
func (r *Repository) GetParagraphStats(ctx context.Context, bookID string, chapterIdx, paragraphIdx int64) (*ParagraphStat, error) {
	stat, err := r.queries.GetParagraphStats(ctx, GetParagraphStatsParams{
		BookID:         bookID,
		ChapterIndex:   chapterIdx,
		ParagraphIndex: paragraphIdx,
	})
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &stat, nil
}

// UpdateParagraphStats updates the skip status and custom styling for a paragraph
func (r *Repository) UpdateParagraphStats(ctx context.Context, params UpdateParagraphStatsParams) error {
	return r.queries.UpdateParagraphStats(ctx, params)
}

// IncrementParagraphUpvote increments the upvotes count for a paragraph
func (r *Repository) IncrementParagraphUpvote(ctx context.Context, bookID string, chapterIdx, paragraphIdx int64) (int64, error) {
	return r.queries.IncrementParagraphUpvote(ctx, IncrementParagraphUpvoteParams{
		BookID:         bookID,
		ChapterIndex:   chapterIdx,
		ParagraphIndex: paragraphIdx,
	})
}

// ListParagraphStatsByChapter retrieves all paragraph stats for a chapter (for paragraph heatmap)
func (r *Repository) ListParagraphStatsByChapter(ctx context.Context, bookID string, chapterIdx int64) ([]ParagraphStat, error) {
	return r.queries.ListParagraphStatsByChapter(ctx, ListParagraphStatsByChapterParams{
		BookID:       bookID,
		ChapterIndex: chapterIdx,
	})
}

// ListChapterStatsByBook retrieves aggregated stats for each chapter (for chapter heatmap)
func (r *Repository) ListChapterStatsByBook(ctx context.Context, bookID string) ([]ListChapterStatsByBookRow, error) {
	return r.queries.ListChapterStatsByBook(ctx, bookID)
}

// GetSentenceAnnotation returns annotations for a specific sentence by its hash
func (r *Repository) GetSentenceAnnotation(ctx context.Context, sentenceHash string) (*SentenceAnnotation, error) {
	ann, err := r.queries.GetSentenceAnnotation(ctx, sentenceHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &ann, nil
}

// ListSentenceAnnotationsByParagraph retrieves all sentence annotations for a paragraph
func (r *Repository) ListSentenceAnnotationsByParagraph(ctx context.Context, bookID string, chapterIdx, paragraphIdx int64) ([]SentenceAnnotation, error) {
	return r.queries.ListSentenceAnnotationsByParagraph(ctx, ListSentenceAnnotationsByParagraphParams{
		BookID:         bookID,
		ChapterIndex:   chapterIdx,
		ParagraphIndex: paragraphIdx,
	})
}

// UpsertSentenceAnnotation saves bookmark, highlight, upvotes, or emoji reactions for a sentence
func (r *Repository) UpsertSentenceAnnotation(ctx context.Context, ann SentenceAnnotation) error {
	return r.queries.UpsertSentenceAnnotation(ctx, UpsertSentenceAnnotationParams{
		SentenceHash:   ann.SentenceHash,
		BookID:         ann.BookID,
		ChapterIndex:   ann.ChapterIndex,
		ParagraphIndex: ann.ParagraphIndex,
		IsBookmarked:   ann.IsBookmarked,
		IsCollapsed:    ann.IsCollapsed,
		HighlightColor: ann.HighlightColor,
		UpvotesCount:   ann.UpvotesCount,
		EmojiReactions: ann.EmojiReactions,
	})
}

// IncrementSentenceUpvote increments and returns the new upvote count for a sentence
func (r *Repository) IncrementSentenceUpvote(ctx context.Context, sentenceHash string, bookID string, chapterIdx, paragraphIdx int64) (int64, error) {
	return r.queries.IncrementSentenceUpvote(ctx, IncrementSentenceUpvoteParams{
		SentenceHash:   sentenceHash,
		BookID:         bookID,
		ChapterIndex:   chapterIdx,
		ParagraphIndex: paragraphIdx,
	})
}

// ListSentenceComments returns all comments for a sentence
func (r *Repository) ListSentenceComments(ctx context.Context, sentenceHash string) ([]SentenceComment, error) {
	return r.queries.ListSentenceComments(ctx, sentenceHash)
}

// ListSentenceCommentsByParagraph returns all comments for an entire book / paragraph
func (r *Repository) ListSentenceCommentsByParagraph(ctx context.Context, bookID string) ([]SentenceComment, error) {
	return r.queries.ListSentenceCommentsByParagraph(ctx, bookID)
}

// CreateSentenceComment adds a marginalia comment to a sentence
func (r *Repository) CreateSentenceComment(ctx context.Context, id, sentenceHash, bookID, content string) error {
	return r.queries.CreateSentenceComment(ctx, CreateSentenceCommentParams{
		ID:           id,
		SentenceHash: sentenceHash,
		BookID:       bookID,
		Content:      content,
	})
}

// DeleteSentenceComment deletes a comment by its unique ID
func (r *Repository) DeleteSentenceComment(ctx context.Context, id string) error {
	return r.queries.DeleteSentenceComment(ctx, id)
}

// UpdateSentenceComment updates a comment's content by its unique ID
func (r *Repository) UpdateSentenceComment(ctx context.Context, id, content string) error {
	return r.queries.UpdateSentenceComment(ctx, UpdateSentenceCommentParams{
		Content: content,
		ID:      id,
	})
}
