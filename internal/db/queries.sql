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

-- name: SeedDefaultPrompts :exec
INSERT OR IGNORE INTO prompts (
    id, name, description, icon, color_palette, system_prompt, user_prompt,
    provider, model, temperature, max_tokens, is_builtin, is_enabled, sort_order,
    scope, book_id, created_at, updated_at
) VALUES 
(
    'prompt-explain',
    'Explain Nuance',
    'Explain literary nuances, historical/cultural context, and subtext of the selected paragraph',
    'Sparkles',
    'ruby',
    'You are a thoughtful reading companion and literary scholar. Analyze the selected text, illuminating subtext, historical/cultural context, metaphorical depth, and emotional resonance in clean, accessible markdown.',
    'Analyze and explain the context, subtext, and literary nuances of the following passage:\n\n{{text}}',
    '', '', 0.7, 2048, 1, 1, 1, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-summarize',
    'Quick Summary',
    'Summarize key ideas and narrative events in 1-2 punchy, concise sentences',
    'FileText',
    'amber',
    'You are an expert reading assistant. Distill the essence of the selected text into a punchy, accurate 1-2 sentence summary.',
    'Provide a concise 1-2 sentence summary capturing the essence of the following passage:\n\n{{text}}',
    '', '', 0.5, 1024, 1, 1, 2, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-vocabulary',
    'Vocabulary & Idioms',
    'Identify notable vocabulary words, archaic phrases, idioms, and literary expressions',
    'Languages',
    'teal',
    'You are a multilingual etymologist and linguist. Identify notable vocabulary words, archaic phrases, literary terms, or idioms from the text, explaining their definitions and nuances concisely.',
    'Identify key vocabulary, rare terms, or idioms in the following passage and explain their meanings:\n\n{{text}}',
    '', '', 0.3, 2048, 1, 1, 3, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-critic',
    'Literary Critique',
    'Critique prose style, pacing, tone, and author techniques',
    'Brain',
    'purple',
    'You are a perceptive literary critic. Critique the prose style, pacing, tone, and literary techniques employed by the author in this passage.',
    'Provide a critical review of the prose style, voice, tone, and narrative techniques in the following excerpt:\n\n{{text}}',
    '', '', 0.7, 2048, 1, 1, 4, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- name: ResetDefaultPrompts :exec
INSERT OR REPLACE INTO prompts (
    id, name, description, icon, color_palette, system_prompt, user_prompt,
    provider, model, temperature, max_tokens, is_builtin, is_enabled, sort_order,
    scope, book_id, created_at, updated_at
) VALUES 
(
    'prompt-explain',
    'Explain Nuance',
    'Explain literary nuances, historical/cultural context, and subtext of the selected paragraph',
    'Sparkles',
    'ruby',
    'You are a thoughtful reading companion and literary scholar. Analyze the selected text, illuminating subtext, historical/cultural context, metaphorical depth, and emotional resonance in clean, accessible markdown.',
    'Analyze and explain the context, subtext, and literary nuances of the following passage:\n\n{{text}}',
    '', '', 0.7, 2048, 1, 1, 1, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-summarize',
    'Quick Summary',
    'Summarize key ideas and narrative events in 1-2 punchy, concise sentences',
    'FileText',
    'amber',
    'You are an expert reading assistant. Distill the essence of the selected text into a punchy, accurate 1-2 sentence summary.',
    'Provide a concise 1-2 sentence summary capturing the essence of the following passage:\n\n{{text}}',
    '', '', 0.5, 1024, 1, 1, 2, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-vocabulary',
    'Vocabulary & Idioms',
    'Identify notable vocabulary words, archaic phrases, idioms, and literary expressions',
    'Languages',
    'teal',
    'You are a multilingual etymologist and linguist. Identify notable vocabulary words, archaic phrases, literary terms, or idioms from the text, explaining their definitions and nuances concisely.',
    'Identify key vocabulary, rare terms, or idioms in the following passage and explain their meanings:\n\n{{text}}',
    '', '', 0.3, 2048, 1, 1, 3, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    'prompt-critic',
    'Literary Critique',
    'Critique prose style, pacing, tone, and author techniques',
    'Brain',
    'purple',
    'You are a perceptive literary critic. Critique the prose style, pacing, tone, and literary techniques employed by the author in this passage.',
    'Provide a critical review of the prose style, voice, tone, and narrative techniques in the following excerpt:\n\n{{text}}',
    '', '', 0.7, 2048, 1, 1, 4, 'global', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- name: ListPrompts :many
SELECT 
    id, name, description, icon, color_palette, system_prompt, user_prompt,
    provider, model, temperature, max_tokens, is_builtin, is_enabled, sort_order,
    scope, book_id, created_at, updated_at
FROM prompts
WHERE scope = 'global' OR (scope = 'book' AND book_id = ?)
ORDER BY sort_order ASC, name ASC;

-- name: GetPromptByID :one
SELECT 
    id, name, description, icon, color_palette, system_prompt, user_prompt,
    provider, model, temperature, max_tokens, is_builtin, is_enabled, sort_order,
    scope, book_id, created_at, updated_at
FROM prompts
WHERE id = ?
LIMIT 1;

-- name: UpsertPrompt :exec
INSERT INTO prompts (
    id, name, description, icon, color_palette, system_prompt, user_prompt,
    provider, model, temperature, max_tokens, is_builtin, is_enabled, sort_order,
    scope, book_id, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    description = excluded.description,
    icon = excluded.icon,
    color_palette = excluded.color_palette,
    system_prompt = excluded.system_prompt,
    user_prompt = excluded.user_prompt,
    provider = excluded.provider,
    model = excluded.model,
    temperature = excluded.temperature,
    max_tokens = excluded.max_tokens,
    is_enabled = excluded.is_enabled,
    sort_order = excluded.sort_order,
    scope = excluded.scope,
    book_id = excluded.book_id,
    updated_at = CURRENT_TIMESTAMP;

-- name: DeletePrompt :exec
DELETE FROM prompts 
WHERE id = ? AND is_builtin = 0;

-- name: IncrementParagraphVisit :one
INSERT INTO paragraph_stats (
    book_id, chapter_index, paragraph_index, visit_count, updated_at
) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
ON CONFLICT(book_id, chapter_index, paragraph_index) DO UPDATE SET
    visit_count = paragraph_stats.visit_count + 1,
    updated_at = CURRENT_TIMESTAMP
RETURNING book_id, chapter_index, paragraph_index, visit_count, is_skipped, custom_font_family, custom_font_size, is_bookmarked, upvotes_count, emoji_reactions, updated_at;

-- name: GetParagraphStats :one
SELECT book_id, chapter_index, paragraph_index, visit_count, is_skipped, custom_font_family, custom_font_size, is_bookmarked, upvotes_count, emoji_reactions, updated_at
FROM paragraph_stats
WHERE book_id = ? AND chapter_index = ? AND paragraph_index = ?;

-- name: UpdateParagraphStats :exec
INSERT INTO paragraph_stats (
    book_id, chapter_index, paragraph_index, is_skipped, custom_font_family, custom_font_size, is_bookmarked, upvotes_count, emoji_reactions, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(book_id, chapter_index, paragraph_index) DO UPDATE SET
    is_skipped = excluded.is_skipped,
    custom_font_family = excluded.custom_font_family,
    custom_font_size = excluded.custom_font_size,
    is_bookmarked = excluded.is_bookmarked,
    upvotes_count = excluded.upvotes_count,
    emoji_reactions = excluded.emoji_reactions,
    updated_at = CURRENT_TIMESTAMP;

-- name: IncrementParagraphUpvote :one
INSERT INTO paragraph_stats (
    book_id, chapter_index, paragraph_index, upvotes_count, updated_at
) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
ON CONFLICT(book_id, chapter_index, paragraph_index) DO UPDATE SET
    upvotes_count = paragraph_stats.upvotes_count + 1,
    updated_at = CURRENT_TIMESTAMP
RETURNING upvotes_count;

-- name: ListParagraphStatsByChapter :many
SELECT book_id, chapter_index, paragraph_index, visit_count, is_skipped, custom_font_family, custom_font_size, is_bookmarked, upvotes_count, emoji_reactions, updated_at
FROM paragraph_stats
WHERE book_id = ? AND chapter_index = ?
ORDER BY paragraph_index ASC;

-- name: ListChapterStatsByBook :many
SELECT 
    c.chapter_index,
    c.title,
    c.paragraph_count,
    COALESCE(SUM(ps.visit_count), 0) AS total_visits,
    COUNT(CASE WHEN ps.visit_count > 0 THEN 1 END) AS visited_paragraphs
FROM chapters c
LEFT JOIN paragraph_stats ps ON ps.book_id = c.book_id AND ps.chapter_index = c.chapter_index
WHERE c.book_id = ?
GROUP BY c.chapter_index, c.title, c.paragraph_count
ORDER BY c.chapter_index ASC;

-- name: GetSentenceAnnotation :one
SELECT sentence_hash, book_id, chapter_index, paragraph_index, is_bookmarked, is_collapsed, highlight_color, upvotes_count, emoji_reactions, updated_at
FROM sentence_annotations
WHERE sentence_hash = ?;

-- name: ListSentenceAnnotationsByParagraph :many
SELECT sentence_hash, book_id, chapter_index, paragraph_index, is_bookmarked, is_collapsed, highlight_color, upvotes_count, emoji_reactions, updated_at
FROM sentence_annotations
WHERE book_id = ? AND chapter_index = ? AND paragraph_index = ?;

-- name: UpsertSentenceAnnotation :exec
INSERT INTO sentence_annotations (
    sentence_hash, book_id, chapter_index, paragraph_index, is_bookmarked, is_collapsed, highlight_color, upvotes_count, emoji_reactions, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(sentence_hash) DO UPDATE SET
    is_bookmarked = excluded.is_bookmarked,
    is_collapsed = excluded.is_collapsed,
    highlight_color = excluded.highlight_color,
    upvotes_count = excluded.upvotes_count,
    emoji_reactions = excluded.emoji_reactions,
    updated_at = CURRENT_TIMESTAMP;

-- name: IncrementSentenceUpvote :one
INSERT INTO sentence_annotations (
    sentence_hash, book_id, chapter_index, paragraph_index, upvotes_count, updated_at
) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
ON CONFLICT(sentence_hash) DO UPDATE SET
    upvotes_count = sentence_annotations.upvotes_count + 1,
    updated_at = CURRENT_TIMESTAMP
RETURNING upvotes_count;

-- name: ListSentenceComments :many
SELECT id, sentence_hash, book_id, content, created_at
FROM sentence_comments
WHERE sentence_hash = ?
ORDER BY created_at ASC;

-- name: ListSentenceCommentsByParagraph :many
SELECT sc.id, sc.sentence_hash, sc.book_id, sc.content, sc.created_at
FROM sentence_comments sc
WHERE sc.book_id = ?
ORDER BY sc.created_at ASC;

-- name: CreateSentenceComment :exec
INSERT INTO sentence_comments (id, sentence_hash, book_id, content, created_at)
VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);

-- name: DeleteSentenceComment :exec
DELETE FROM sentence_comments WHERE id = ?;

-- name: UpdateSentenceComment :exec
UPDATE sentence_comments
SET content = ?
WHERE id = ?;
