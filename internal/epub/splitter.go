package epub

import (
	"regexp"
	"strings"
)

var multiNewlineRegex = regexp.MustCompile(`\n{2,}`)
var frontmatterRegex = regexp.MustCompile(`(?s)^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]?`)

// ExtractFrontmatterAndBody parses YAML frontmatter (--- ... ---) from markdown text.
// Returns frontmatter metadata map, stripped markdown body, and extracted title (if any).
func ExtractFrontmatterAndBody(md string) (map[string]string, string, string) {
	normalized := strings.ReplaceAll(md, "\r\n", "\n")
	normalized = strings.ReplaceAll(normalized, "\r", "\n")

	meta := make(map[string]string)
	title := ""

	loc := frontmatterRegex.FindStringSubmatchIndex(normalized)
	if loc == nil || loc[0] != 0 {
		return meta, strings.TrimSpace(normalized), ""
	}

	rawMeta := normalized[loc[2]:loc[3]]
	body := strings.TrimSpace(normalized[loc[1]:])

	for _, line := range strings.Split(rawMeta, "\n") {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" || strings.HasPrefix(trimmed, "#") {
			continue
		}
		parts := strings.SplitN(trimmed, ":", 2)
		if len(parts) == 2 {
			k := strings.ToLower(strings.TrimSpace(parts[0]))
			v := strings.TrimSpace(parts[1])
			v = strings.Trim(v, `"'`)
			meta[k] = v
			if k == "title" {
				title = v
			}
		}
	}

	return meta, body, title
}

// SplitMarkdownIntoParagraphs splits markdown text into semantic blocks, ignoring frontmatter
func SplitMarkdownIntoParagraphs(md string) []string {
	_, body, _ := ExtractFrontmatterAndBody(md)
	parts := multiNewlineRegex.Split(body, -1)
	var blocks []string

	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		blocks = append(blocks, trimmed)
	}

	return blocks
}
