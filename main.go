package main

import (
	"embed"
	"log"
	"os"

	"github.com/raitucarp/periodus/internal/config"
	"github.com/raitucarp/periodus/internal/db"
	"github.com/raitucarp/periodus/internal/epub"
	"github.com/raitucarp/periodus/internal/llm"
	"github.com/raitucarp/periodus/internal/openlibrary"
	"github.com/raitucarp/periodus/internal/service"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:ui/dist
var assets embed.FS

func main() {
	cfg, err := config.GetConfig()
	if err != nil {
		log.Fatalf("failed to initialize config: %v", err)
	}

	repo, err := db.NewRepository(cfg.DBPath)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer repo.Close()

	olClient := openlibrary.NewClient()
	extractor := epub.NewExtractor(cfg.BooksDir, cfg.CoversDir, olClient)

	bookService := service.NewBookService(repo, extractor)
	readerService := service.NewReaderService(repo)

	// Setup LLM Provider
	apiKey, _ := repo.GetSetting("gemini_api_key")
	if apiKey == "" {
		apiKey = os.Getenv("GEMINI_API_KEY")
	}

	var initialProvider llm.Provider
	if apiKey != "" {
		if p, err := llm.NewGenkitProvider(apiKey, "googleai/gemini-2.5-flash"); err == nil {
			initialProvider = p
		}
	}
	aiService := service.NewAIService(repo, initialProvider)

	settingsService := service.NewSettingsService(repo, func(newKey string) {
		if p, err := llm.NewGenkitProvider(newKey, "googleai/gemini-2.5-flash"); err == nil {
			service.SetLegacyProvider(aiService, p)
		}
	})

	dictionaryService := service.NewDictionaryService()

	app := application.New(application.Options{
		Name:        "Periodus",
		Description: "Modern EPUB Reader with AI text insights",
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Services: []application.Service{
			application.NewServiceWithOptions(bookService, application.ServiceOptions{Name: "BookService"}),
			application.NewServiceWithOptions(readerService, application.ServiceOptions{Name: "ReaderService"}),
			application.NewServiceWithOptions(aiService, application.ServiceOptions{Name: "AIService"}),
			application.NewServiceWithOptions(settingsService, application.ServiceOptions{Name: "SettingsService"}),
			application.NewServiceWithOptions(dictionaryService, application.ServiceOptions{Name: "DictionaryService"}),
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:     "Periodus",
		Width:     1280,
		Height:    840,
		MinWidth:  900,
		MinHeight: 600,
		Frameless: true,
		URL:       "/",
	})

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
