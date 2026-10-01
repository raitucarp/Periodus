package openlibrary

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	ol "github.com/raitucarp/openlibrary-go"
)

type FallbackMetadata struct {
	Author      string
	Description string
	CoverPath   string
}

type Client struct {
	olClient *ol.Client
}

func NewClient() *Client {
	return &Client{
		olClient: ol.NewClient(),
	}
}

// SearchAndDownloadFallback searches OpenLibrary for metadata & cover given a title
func (c *Client) SearchAndDownloadFallback(title string, saveCoverDir string, bookID string) (*FallbackMetadata, error) {
	cleanTitle := strings.TrimSpace(title)
	if cleanTitle == "" {
		return nil, fmt.Errorf("title cannot be empty")
	}

	resp, err := c.olClient.Search().Query(cleanTitle).Do()
	if err != nil {
		return nil, err
	}

	if resp == nil || len(resp.Docs) == 0 {
		return nil, fmt.Errorf("no openlibrary matches found for '%s'", cleanTitle)
	}

	bestDoc := resp.Docs[0]
	result := &FallbackMetadata{}

	if len(bestDoc.AuthorName) > 0 {
		result.Author = strings.Join(bestDoc.AuthorName, ", ")
	}

	// Try downloading cover if CoverI is present
	if bestDoc.CoverI > 0 {
		coverIDStr := fmt.Sprintf("%d", bestDoc.CoverI)
		imgBytes, _, err := c.olClient.Cover().ID(coverIDStr).Medium().Get()
		if err == nil && len(imgBytes) > 0 {
			coverFileName := fmt.Sprintf("%s.jpg", bookID)
			targetPath := filepath.Join(saveCoverDir, coverFileName)
			if err := os.WriteFile(targetPath, imgBytes, 0644); err == nil {
				result.CoverPath = targetPath
			}
		}
	}

	return result, nil
}
