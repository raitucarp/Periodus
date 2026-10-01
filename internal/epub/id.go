package epub

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
)

// GenerateBookID generates a stable ID from the file path and file size
func GenerateBookID(filePath string) string {
	info, err := os.Stat(filePath)
	var size int64
	if err == nil {
		size = info.Size()
	}
	hash := sha256.Sum256([]byte(fmt.Sprintf("%s:%d", filepath.Base(filePath), size)))
	return hex.EncodeToString(hash[:8])
}
