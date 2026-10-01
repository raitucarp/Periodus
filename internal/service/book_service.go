package service

import (
	"fmt"
	"os"

	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/epub"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type BookService struct {
	repo      *db.Repository
	extractor *epub.Extractor
}

func NewBookService(repo *db.Repository, extractor *epub.Extractor) *BookService {
	return &BookService{
		repo:      repo,
		extractor: extractor,
	}
}

func (s *BookService) GetAllBooks() ([]db.ListBooksRow, error) {
	books, err := s.repo.GetAllBooks()
	if err != nil {
		return nil, err
	}
	// Enrich with base64 cover if present
	for i := range books {
		if books[i].CoverPath != "" {
			if dataURI, err := GetCoverDataURI(books[i].CoverPath); err == nil {
				books[i].CoverPath = dataURI
			}
		}
	}
	return books, nil
}

func (s *BookService) GetBook(id string) (*db.GetBookByIDRow, error) {
	book, err := s.repo.GetBookByID(id)
	if err != nil {
		return nil, err
	}
	if book.CoverPath != "" {
		if dataURI, err := GetCoverDataURI(book.CoverPath); err == nil {
			book.CoverPath = dataURI
		}
	}
	return book, nil
}

func (s *BookService) SelectAndImportBook() (*db.GetBookByIDRow, error) {
	dialog := application.Get().Dialog.OpenFile()
	dialog.SetTitle("Pilih File EPUB")
	dialog.AddFilter("EPUB Files (*.epub)", "*.epub")
	filePath, err := dialog.PromptForSingleSelection()
	if err != nil {
		return nil, err
	}
	if filePath == "" {
		return nil, nil // user cancelled
	}
	return s.ImportBook(filePath)
}

func (s *BookService) ImportBook(filePath string) (*db.GetBookByIDRow, error) {
	if _, err := os.Stat(filePath); err != nil {
		return nil, fmt.Errorf("file tidak ditemukan: %w", err)
	}

	extracted, err := s.extractor.Extract(filePath)
	if err != nil {
		return nil, fmt.Errorf("gagal mengekstrak epub: %w", err)
	}

	if err := s.repo.SaveBook(extracted.Book); err != nil {
		return nil, fmt.Errorf("gagal menyimpan buku: %w", err)
	}

	if err := s.repo.SaveChapters(extracted.Chapters); err != nil {
		return nil, fmt.Errorf("gagal menyimpan chapter: %w", err)
	}

	if err := s.repo.SaveParagraphs(extracted.Paragraphs); err != nil {
		return nil, fmt.Errorf("gagal menyimpan paragraf: %w", err)
	}

	// Initialize reading progress
	_ = s.repo.SaveProgress(extracted.Book.ID, 1, 1, 0.0)

	return s.GetBook(extracted.Book.ID)
}

func (s *BookService) DeleteBook(id string) error {
	return s.repo.DeleteBook(id)
}
