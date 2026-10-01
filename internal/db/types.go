package db

type ModelConfig struct {
	Provider    string  `json:"provider"`
	Model       string  `json:"model"`
	ApiKey      string  `json:"apiKey"`
	BaseUrl     string  `json:"baseUrl"`
	Temperature float64 `json:"temperature"`
	MaxTokens   int     `json:"maxTokens"`
}

type EmbeddingConfig struct {
	Provider   string `json:"provider"`
	Model      string `json:"model"`
	ApiKey     string `json:"apiKey"`
	BaseUrl    string `json:"baseUrl"`
	Dimensions int    `json:"dimensions"`
}

type VisionConfig struct {
	Provider string `json:"provider"`
	Model    string `json:"model"`
	ApiKey   string `json:"apiKey"`
	BaseUrl  string `json:"baseUrl"`
}

type AISettings struct {
	Scope     string          `json:"scope"`
	UseGlobal bool            `json:"useGlobal"`
	Chat      ModelConfig     `json:"chat"`
	Embedding EmbeddingConfig `json:"embedding"`
	Vision    VisionConfig    `json:"vision"`
}

type ReadingSettings struct {
	Scope      string `json:"scope"`
	FontFamily string `json:"fontFamily"`
	FontSize   int    `json:"fontSize"`
	LineHeight string `json:"lineHeight"`
	MaxWidth   string `json:"maxWidth"`
	TextAlign  string `json:"textAlign"`
}
