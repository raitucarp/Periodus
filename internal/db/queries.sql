-- name: ListBooks :many
SELECT 
    b.id, b.title, b.author, b.description, b.publisher, b.language, 
    b.cover_path, b.source_file_path, b.total_chapters, b.total_paragraphs,
    b.created_at, b.updated_at,
    CAST(COALESCE(p.current_chapter_index, 1) AS INTEGER) AS current_chapter_index,
    CAST(COALESCE(p.current_paragraph_index, 1) AS INTEGER) AS current_paragraph_index,
    CAST(COALESCE(p.percent_complete, 0.0) AS REAL) AS percent_complete,
    CAST(COALESCE(p.last_read_at, b.created_at) AS TEXT) AS last_read_at
FROM books b
LEFT JOIN reading_progress p ON b.id = p.book_id
ORDER BY COALESCE(p.last_read_at, b.created_at) DESC;

-- name: GetBookByID :one
SELECT 
    b.id, b.title, b.author, b.description, b.publisher, b.language, 
    b.cover_path, b.source_file_path, b.total_chapters, b.total_paragraphs,
    b.created_at, b.updated_at,
    CAST(COALESCE(p.current_chapter_index, 1) AS INTEGER) AS current_chapter_index,
    CAST(COALESCE(p.current_paragraph_index, 1) AS INTEGER) AS current_paragraph_index,
    CAST(COALESCE(p.percent_complete, 0.0) AS REAL) AS percent_complete,
    CAST(COALESCE(p.last_read_at, b.created_at) AS TEXT) AS last_read_at
FROM books b
LEFT JOIN reading_progress p ON b.id = p.book_id
WHERE b.id = ?;

-- name: UpsertBook :exec
INSERT INTO books (
    id, title, author, description, publisher, language, 
    cover_path, source_file_path, total_chapters, total_paragraphs, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    author = excluded.author,
    description = excluded.description,
    publisher = excluded.publisher,
    language = excluded.language,
    cover_path = excluded.cover_path,
    total_chapters = excluded.total_chapters,
    total_paragraphs = excluded.total_paragraphs,
    updated_at = CURRENT_TIMESTAMP;

-- name: DeleteBook :exec
DELETE FROM books WHERE id = ?;

-- name: UpsertChapter :exec
INSERT INTO chapters (id, book_id, chapter_index, title, file_path, paragraph_count)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    file_path = excluded.file_path,
    paragraph_count = excluded.paragraph_count;

-- name: ListChaptersByBookID :many
SELECT id, book_id, chapter_index, title, file_path, paragraph_count, created_at
FROM chapters
WHERE book_id = ?
ORDER BY chapter_index ASC;

-- name: UpsertParagraph :exec
INSERT INTO paragraphs (id, book_id, chapter_index, paragraph_index, file_path, content_preview)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
    file_path = excluded.file_path,
    content_preview = excluded.content_preview;

-- name: ListParagraphsByChapter :many
SELECT id, book_id, chapter_index, paragraph_index, file_path, content_preview, created_at
FROM paragraphs
WHERE book_id = ? AND chapter_index = ?
ORDER BY paragraph_index ASC;

-- name: GetParagraphByID :one
SELECT id, book_id, chapter_index, paragraph_index, file_path, content_preview, created_at
FROM paragraphs
WHERE id = ?;

-- name: UpsertProgress :exec
INSERT INTO reading_progress (book_id, current_chapter_index, current_paragraph_index, percent_complete, last_read_at)
VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(book_id) DO UPDATE SET
    current_chapter_index = excluded.current_chapter_index,
    current_paragraph_index = excluded.current_paragraph_index,
    percent_complete = excluded.percent_complete,
    last_read_at = CURRENT_TIMESTAMP;

-- name: GetProgress :one
SELECT book_id, current_chapter_index, current_paragraph_index, percent_complete, last_read_at
FROM reading_progress
WHERE book_id = ?;

-- name: GetSetting :one
SELECT value FROM settings WHERE key = ?;

-- name: SetSetting :exec
INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;

-- name: UpsertParagraphEmbedding :exec
INSERT INTO paragraph_embeddings (id, paragraph_id, book_id, embedding, dimensions, model, created_at)
VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
    embedding = excluded.embedding,
    dimensions = excluded.dimensions,
    model = excluded.model,
    created_at = CURRENT_TIMESTAMP;

-- name: GetParagraphEmbedding :one
SELECT id, paragraph_id, book_id, embedding, dimensions, model, created_at
FROM paragraph_embeddings
WHERE paragraph_id = ?;

-- name: ListParagraphEmbeddingsByBook :many
SELECT id, paragraph_id, book_id, embedding, dimensions, model, created_at
FROM paragraph_embeddings
WHERE book_id = ?;

-- name: DeleteEmbeddingsByBookID :exec
DELETE FROM paragraph_embeddings WHERE book_id = ?;
