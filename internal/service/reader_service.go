package service

import (
	"fmt"
	"os"

	"github.com/raitucarp/periodus/internal/db"
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
			return string(bytes), nil
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
