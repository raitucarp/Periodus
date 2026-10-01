package service

import (
	"context"

	"github.com/raitucarp/periodus/internal/dictionary"
)

// DictionaryService provides offline dictionary lookups for English vocabulary using gown.
type DictionaryService struct {
	dict *dictionary.WordNetDictionary
}

// NewDictionaryService creates a new DictionaryService.
func NewDictionaryService() *DictionaryService {
	return &DictionaryService{
		dict: dictionary.NewWordNetDictionary(),
	}
}

// LookupEnglishWord queries the offline WordNet dictionary for definitions and examples.
func (s *DictionaryService) LookupEnglishWord(ctx context.Context, word string) ([]dictionary.WordEntry, error) {
	return s.dict.Lookup(word)
}
