package epub

import (
	"regexp"
	"strings"
)

var multiNewlineRegex = regexp.MustCompile(`\n{2,}`)

// SplitMarkdownIntoParagraphs splits markdown text into semantic blocks
func SplitMarkdownIntoParagraphs(md string) []string {
	normalized := strings.ReplaceAll(md, "\r\n", "\n")
	normalized = strings.ReplaceAll(normalized, "\r", "\n")

	parts := multiNewlineRegex.Split(normalized, -1)
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
