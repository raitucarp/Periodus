package dictionary

import (
	"testing"
)

func TestWordNetDictionaryLookup(t *testing.T) {
	dict := NewWordNetDictionary()
	entries, err := dict.Lookup("preacher")
	if err != nil {
		t.Fatalf("unexpected error looking up preacher: %v", err)
	}

	if len(entries) == 0 {
		t.Fatalf("expected at least one entry for 'preacher', got 0")
	}

	foundDef := false
	for _, entry := range entries {
		if len(entry.Definitions) > 0 {
			foundDef = true
			break
		}
	}

	if !foundDef {
		t.Fatalf("expected definitions for 'preacher'")
	}
}
