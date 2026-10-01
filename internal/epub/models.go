package epub

import (
	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/openlibrary"
)

type Extractor struct {
	booksDir  string
	coversDir string
	olClient  *openlibrary.Client
}

type ExtractedBookData struct {
	Book       *db.Book
	Chapters   []db.Chapter
	Paragraphs []db.Paragraph
}
