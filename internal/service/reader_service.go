package service

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/epub"
)

type ReaderService struct {
	repo *db.Repository
}

func NewReaderService(repo *db.Repository) *ReaderService {
	return &ReaderService{repo: repo}
}

func (s *ReaderService) GetChapters(bookID string) ([]db.Chapter, error) {
	return s.repo.GetChaptersByBookID(bookID)
}

func (s *ReaderService) GetParagraphs(bookID string, chapterIndex int) ([]db.Paragraph, error) {
	return s.repo.GetParagraphsByChapter(bookID, int64(chapterIndex))
}

func (s *ReaderService) GetParagraphContent(bookID string, chapterIndex int, paragraphIndex int) (string, error) {
	paragraphs, err := s.repo.GetParagraphsByChapter(bookID, int64(chapterIndex))
	if err != nil {
		return "", err
	}

	pIdx := int64(paragraphIndex)
	for _, p := range paragraphs {
		if p.ParagraphIndex == pIdx {
			bytes, err := os.ReadFile(p.FilePath)
			if err != nil {
				return "", fmt.Errorf("gagal membaca file paragraf: %w", err)
			}
			content := string(bytes)
			_, body, _ := epub.ExtractFrontmatterAndBody(content)
			if strings.TrimSpace(body) != "" {
				return body, nil
			}
			return content, nil
		}
	}

	return "", fmt.Errorf("paragraf %d tidak ditemukan di chapter %d", paragraphIndex, chapterIndex)
}

func (s *ReaderService) SaveProgress(bookID string, chapterIndex int, paragraphIndex int, percent float64) error {
	return s.repo.SaveProgress(bookID, int64(chapterIndex), int64(paragraphIndex), percent)
}

func (s *ReaderService) GetProgress(bookID string) (*db.ReadingProgress, error) {
	return s.repo.GetProgress(bookID)
}

// IncrementParagraphVisit increments and returns hit counter for a paragraph
func (s *ReaderService) IncrementParagraphVisit(bookID string, chapterIndex int, paragraphIndex int) (*db.ParagraphStat, error) {
	return s.repo.IncrementParagraphVisit(context.Background(), bookID, int64(chapterIndex), int64(paragraphIndex))
}

// GetParagraphStats returns statistics and customization for a paragraph
func (s *ReaderService) GetParagraphStats(bookID string, chapterIndex int, paragraphIndex int) (*db.ParagraphStat, error) {
	return s.repo.GetParagraphStats(context.Background(), bookID, int64(chapterIndex), int64(paragraphIndex))
}

// UpdateParagraphStats updates skip status, custom styling, bookmark, and reactions for a paragraph
func (s *ReaderService) UpdateParagraphStats(bookID string, chapterIndex int, paragraphIndex int, isSkipped bool, customFontFamily string, customFontSize float64, isBookmarked bool, upvotesCount int64, emojiReactions string) error {
	skipVal := int64(0)
	if isSkipped {
		skipVal = 1
	}
	bmVal := int64(0)
	if isBookmarked {
		bmVal = 1
	}
	if emojiReactions == "" {
		emojiReactions = "[]"
	}
	return s.repo.UpdateParagraphStats(context.Background(), db.UpdateParagraphStatsParams{
		BookID:           bookID,
		ChapterIndex:     int64(chapterIndex),
		ParagraphIndex:   int64(paragraphIndex),
		IsSkipped:        skipVal,
		CustomFontFamily: customFontFamily,
		CustomFontSize:   customFontSize,
		IsBookmarked:     bmVal,
		UpvotesCount:     upvotesCount,
		EmojiReactions:   emojiReactions,
	})
}

// IncrementParagraphUpvote increments upvotes for a paragraph
func (s *ReaderService) IncrementParagraphUpvote(bookID string, chapterIndex int, paragraphIndex int) (int64, error) {
	return s.repo.IncrementParagraphUpvote(context.Background(), bookID, int64(chapterIndex), int64(paragraphIndex))
}

// GetChapterHeatmap returns chapter-level visit counts for the chapter heatmap
func (s *ReaderService) GetChapterHeatmap(bookID string) ([]db.ListChapterStatsByBookRow, error) {
	return s.repo.ListChapterStatsByBook(context.Background(), bookID)
}

// GetParagraphHeatmap returns paragraph-level visit counts for the paragraph heatmap
func (s *ReaderService) GetParagraphHeatmap(bookID string, chapterIndex int) ([]db.ParagraphStat, error) {
	return s.repo.ListParagraphStatsByChapter(context.Background(), bookID, int64(chapterIndex))
}

// GetSentenceAnnotations returns all sentence annotations for a paragraph
func (s *ReaderService) GetSentenceAnnotations(bookID string, chapterIndex int, paragraphIndex int) ([]db.SentenceAnnotation, error) {
	return s.repo.ListSentenceAnnotationsByParagraph(context.Background(), bookID, int64(chapterIndex), int64(paragraphIndex))
}

// SaveSentenceAnnotation creates or updates sentence annotation (bookmark, highlight, emoji reactions)
func (s *ReaderService) SaveSentenceAnnotation(ann db.SentenceAnnotation) error {
	return s.repo.UpsertSentenceAnnotation(context.Background(), ann)
}

// IncrementSentenceUpvote increments upvotes for a sentence
func (s *ReaderService) IncrementSentenceUpvote(sentenceHash string, bookID string, chapterIndex int, paragraphIndex int) (int64, error) {
	return s.repo.IncrementSentenceUpvote(context.Background(), sentenceHash, bookID, int64(chapterIndex), int64(paragraphIndex))
}

// GetSentenceComments returns all comments for a sentence
func (s *ReaderService) GetSentenceComments(sentenceHash string) ([]db.SentenceComment, error) {
	return s.repo.ListSentenceComments(context.Background(), sentenceHash)
}

// GetParagraphComments returns all comments in the book/paragraph
func (s *ReaderService) GetParagraphComments(bookID string) ([]db.SentenceComment, error) {
	return s.repo.ListSentenceCommentsByParagraph(context.Background(), bookID)
}

// AddSentenceComment adds a marginalia comment to a sentence
func (s *ReaderService) AddSentenceComment(id, sentenceHash, bookID, content string) error {
	return s.repo.CreateSentenceComment(context.Background(), id, sentenceHash, bookID, content)
}

// DeleteSentenceComment removes a comment by ID
func (s *ReaderService) DeleteSentenceComment(id string) error {
	return s.repo.DeleteSentenceComment(context.Background(), id)
}

// UpdateSentenceComment edits the content of an existing marginalia comment
func (s *ReaderService) UpdateSentenceComment(id, content string) error {
	return s.repo.UpdateSentenceComment(context.Background(), id, content)
}
