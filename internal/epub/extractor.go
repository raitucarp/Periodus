package epub

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/raitucarp/epub"
	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/openlibrary"
)

func NewExtractor(booksDir, coversDir string, olClient *openlibrary.Client) *Extractor {
	return &Extractor{
		booksDir:  booksDir,
		coversDir: coversDir,
		olClient:  olClient,
	}
}

func (e *Extractor) Extract(epubPath string) (*ExtractedBookData, error) {
	reader, err := epub.OpenReader(epubPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open epub: %w", err)
	}

	bookID := GenerateBookID(epubPath)
	bookOutputDir := filepath.Join(e.booksDir, bookID)
	chaptersDir := filepath.Join(bookOutputDir, "chapters")

	if err := os.MkdirAll(chaptersDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create book directory: %w", err)
	}

	// 1. Extract Metadata
	title := ""
	if titles := reader.Title(); len(titles) > 0 && strings.TrimSpace(titles[0]) != "" {
		title = strings.TrimSpace(titles[0])
	} else {
		// Fallback to filename without extension
		base := filepath.Base(epubPath)
		ext := filepath.Ext(base)
		title = strings.TrimSuffix(base, ext)
	}

	author := ""
	if authors := reader.Author(); len(authors) > 0 {
		author = strings.Join(authors, ", ")
	}

	description := ""
	if desc := reader.Description(); len(desc) > 0 {
		description = strings.Join(desc, "\n")
	}

	language := "en"
	if langs := reader.Language(); len(langs) > 0 {
		language = langs[0]
	}

	// 2. Extract Cover
	coverPath := ""
	if coverBytes, err := reader.CoverBytes(); err == nil && len(coverBytes) > 0 {
		cPath := filepath.Join(e.coversDir, fmt.Sprintf("%s.jpg", bookID))
		if err := os.WriteFile(cPath, coverBytes, 0644); err == nil {
			coverPath = cPath
		}
	}

	// Fallback to OpenLibrary if cover or author is missing
	if coverPath == "" && e.olClient != nil {
		if meta, err := e.olClient.SearchAndDownloadFallback(title, e.coversDir, bookID); err == nil && meta != nil {
			if coverPath == "" && meta.CoverPath != "" {
				coverPath = meta.CoverPath
			}
			if author == "" && meta.Author != "" {
				author = meta.Author
			}
		}
	}

	// 3. Extract Chapters & Paragraphs via Spine
	spine := reader.Spine()
	if len(spine) == 0 {
		// Fallback: list content document IDs if spine is empty
		for _, id := range reader.ListContentDocumentIds() {
			spine = append(spine, epub.PublicationResource{ID: id})
		}
	}

	var chapters []db.Chapter
	var allParagraphs []db.Paragraph
	var totalParagraphCount int64 = 0
	var chapterIndex int64 = 1

	for _, item := range spine {
		md := ""
		if item.ID != "" {
			md = reader.ReadContentMarkdownById(item.ID)
		}
		if md == "" && item.Href != "" {
			md = reader.ReadContentMarkdownByHref(item.Href)
		}

		cleanMD := strings.TrimSpace(md)
		if cleanMD == "" {
			continue // Skip completely empty sections
		}

		// Extract frontmatter metadata and body
		_, bodyMD, fmTitle := ExtractFrontmatterAndBody(cleanMD)
		contentToUse := bodyMD
		if strings.TrimSpace(contentToUse) == "" {
			contentToUse = cleanMD
		}

		chapterFolder := filepath.Join(chaptersDir, fmt.Sprintf("ch_%d", chapterIndex))
		if err := os.MkdirAll(chapterFolder, 0755); err != nil {
			return nil, err
		}

		chapterMDPath := filepath.Join(chapterFolder, "chapter.md")
		if err := os.WriteFile(chapterMDPath, []byte(contentToUse), 0644); err != nil {
			return nil, err
		}

		// Determine chapter title: first try frontmatter title, then headers (#, ##, ###)
		chTitle := fmTitle
		if chTitle == "" {
			for _, line := range strings.Split(contentToUse, "\n") {
				trimmed := strings.TrimSpace(line)
				if strings.HasPrefix(trimmed, "# ") {
					chTitle = strings.TrimPrefix(trimmed, "# ")
					break
				} else if strings.HasPrefix(trimmed, "## ") {
					chTitle = strings.TrimPrefix(trimmed, "## ")
					break
				} else if strings.HasPrefix(trimmed, "### ") {
					chTitle = strings.TrimPrefix(trimmed, "### ")
					break
				}
			}
		}
		if chTitle == "" {
			chTitle = fmt.Sprintf("Chapter %d", chapterIndex)
		}

		// Split into semantic blocks (paragraph_n.md)
		rawBlocks := SplitMarkdownIntoParagraphs(contentToUse)
		var pCountInChapter int64 = 0

		for pIdx, block := range rawBlocks {
			paragraphIndex := int64(pIdx + 1)
			pFileName := fmt.Sprintf("paragraph_%d.md", paragraphIndex)
			pFilePath := filepath.Join(chapterFolder, pFileName)

			if err := os.WriteFile(pFilePath, []byte(block), 0644); err != nil {
				return nil, err
			}

			preview := block
			if len(preview) > 120 {
				preview = preview[:120] + "..."
			}

			pRecord := db.Paragraph{
				ID:             fmt.Sprintf("%s_%d_%d", bookID, chapterIndex, paragraphIndex),
				BookID:         bookID,
				ChapterIndex:   chapterIndex,
				ParagraphIndex: paragraphIndex,
				FilePath:       pFilePath,
				ContentPreview: preview,
			}
			allParagraphs = append(allParagraphs, pRecord)
			pCountInChapter++
			totalParagraphCount++
		}

		if pCountInChapter > 0 {
			chRecord := db.Chapter{
				ID:             fmt.Sprintf("%s_%d", bookID, chapterIndex),
				BookID:         bookID,
				ChapterIndex:   chapterIndex,
				Title:          chTitle,
				FilePath:       chapterMDPath,
				ParagraphCount: pCountInChapter,
			}
			chapters = append(chapters, chRecord)
			chapterIndex++
		}
	}

	bookRecord := &db.Book{
		ID:              bookID,
		Title:           title,
		Author:          author,
		Description:     description,
		Language:        language,
		CoverPath:       coverPath,
		SourceFilePath:  epubPath,
		TotalChapters:   int64(len(chapters)),
		TotalParagraphs: totalParagraphCount,
	}

	return &ExtractedBookData{
		Book:       bookRecord,
		Chapters:   chapters,
		Paragraphs: allParagraphs,
	}, nil
}
