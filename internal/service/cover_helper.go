package service

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
)

// GetCoverDataURI reads an image file and converts it into a base64 data URI
func GetCoverDataURI(coverPath string) (string, error) {
	bytes, err := os.ReadFile(coverPath)
	if err != nil {
		return "", err
	}

	ext := filepath.Ext(coverPath)
	mime := "image/jpeg"
	if ext == ".png" {
		mime = "image/png"
	} else if ext == ".webp" {
		mime = "image/webp"
	}

	encoded := base64.StdEncoding.EncodeToString(bytes)
	return fmt.Sprintf("data:%s;base64,%s", mime, encoded), nil
}
