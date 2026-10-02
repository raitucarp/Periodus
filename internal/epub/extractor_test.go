package epub

import (
	"testing"
)

func TestSplitMarkdownIntoParagraphs(t *testing.T) {
	sampleMD := `# Bab 1: Petualangan Baru

Ini adalah paragraf pertama yang menceritakan perjalanan tokoh utama melintasi hutan lebat.

Ini adalah paragraf kedua yang memberikan deskripsi mendalam mengenai suasana senja.

> Ini adalah sebuah kutipan penting di tengah cerita.

Dan ini adalah paragraf penutup di bab satu.`

	blocks := SplitMarkdownIntoParagraphs(sampleMD)

	if len(blocks) != 5 {
		t.Fatalf("expected 5 semantic blocks, got %d", len(blocks))
	}

	if blocks[0] != "# Bab 1: Petualangan Baru" {
		t.Errorf("block 0 unexpected: %q", blocks[0])
	}

	if blocks[3] != "> Ini adalah sebuah kutipan penting di tengah cerita." {
		t.Errorf("block 3 unexpected: %q", blocks[3])
	}

	listMD := `Paragraf pengantar:
- Item satu
- Item dua
- Item tiga
Paragraf penutup.`

	listBlocks := SplitMarkdownIntoParagraphs(listMD)
	if len(listBlocks) != 3 {
		t.Fatalf("expected 3 blocks for list separation, got %d", len(listBlocks))
	}
	if listBlocks[0] != "Paragraf pengantar:" {
		t.Errorf("expected intro block, got %q", listBlocks[0])
	}
	if listBlocks[1] != "- Item satu\n- Item dua\n- Item tiga" {
		t.Errorf("expected list block, got %q", listBlocks[1])
	}
	if listBlocks[2] != "Paragraf penutup." {
		t.Errorf("expected closing block, got %q", listBlocks[2])
	}
}

func TestGenerateBookID(t *testing.T) {
	id1 := GenerateBookID("test_book.epub")
	id2 := GenerateBookID("test_book.epub")
	id3 := GenerateBookID("another_book.epub")

	if id1 != id2 {
		t.Errorf("expected deterministic IDs for same path, got %s and %s", id1, id2)
	}

	if id1 == id3 {
		t.Errorf("expected distinct IDs for different paths")
	}
}
