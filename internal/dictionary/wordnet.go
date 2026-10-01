package dictionary

import (
	"strings"
	"sync"

	"github.com/raitucarp/gown"
)

// WordDefinition represents an individual definition, its part of speech, and examples.
type WordDefinition struct {
	PartOfSpeech string   `json:"part_of_speech"`
	Definition   string   `json:"definition"`
	Examples     []string `json:"examples"`
}

// WordEntry represents an English vocabulary lookup result.
type WordEntry struct {
	Word        string           `json:"word"`
	Definitions []WordDefinition `json:"definitions"`
}

// WordNetDictionary provides offline English vocabulary lookup using gown.
type WordNetDictionary struct {
	resource *gown.LexicalResource
	mu       sync.RWMutex
	loaded   bool
}

// NewWordNetDictionary creates a new WordNetDictionary instance.
func NewWordNetDictionary() *WordNetDictionary {
	return &WordNetDictionary{}
}

// EnsureLoaded lazy-loads the lexical resource thread-safely.
func (d *WordNetDictionary) EnsureLoaded() error {
	d.mu.RLock()
	if d.loaded {
		d.mu.RUnlock()
		return nil
	}
	d.mu.RUnlock()

	d.mu.Lock()
	defer d.mu.Unlock()

	if d.loaded {
		return nil
	}

	res, err := gown.ReadLexicalResource()
	if err != nil {
		return err
	}
	d.resource = res
	d.loaded = true
	return nil
}

// Lookup queries WordNet for a given English word or lemma.
func (d *WordNetDictionary) Lookup(word string) ([]WordEntry, error) {
	cleanWord := strings.TrimSpace(strings.ToLower(word))
	if cleanWord == "" {
		return nil, nil
	}

	if err := d.EnsureLoaded(); err != nil {
		return nil, err
	}

	entries := d.resource.Lookup(cleanWord)
	if len(entries) == 0 {
		return nil, nil
	}

	results := make([]WordEntry, 0, len(entries))
	for _, entry := range entries {
		var defs []WordDefinition
		for _, synset := range entry.Synsets() {
			if synset == nil {
				continue
			}
			exs := make([]string, 0, len(synset.Examples))
			for _, ex := range synset.Examples {
				if ex.Text != "" {
					exs = append(exs, ex.Text)
				}
			}
			defs = append(defs, WordDefinition{
				PartOfSpeech: string(entry.PartOfSpeech()),
				Definition:   synset.PrimaryDefinition(),
				Examples:     exs,
			})
		}
		if len(defs) == 0 {
			for _, def := range entry.Definitions() {
				defs = append(defs, WordDefinition{
					PartOfSpeech: string(entry.PartOfSpeech()),
					Definition:   def,
					Examples:     entry.Examples(),
				})
			}
		}

		results = append(results, WordEntry{
			Word:        entry.Lemma.WrittenForm,
			Definitions: defs,
		})
	}

	return results, nil
}
