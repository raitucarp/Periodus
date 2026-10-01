package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/raitucarp/periodus/internal/db"
)

type Client struct {
	httpClient *http.Client
}

func NewClient() *Client {
	return &Client{
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// GenerateChat sends a prompt to the configured LLM provider and returns the text response
func (c *Client) GenerateChat(ctx context.Context, cfg db.ModelConfig, systemInstruction, promptText string) (string, error) {
	provider := strings.ToLower(strings.TrimSpace(cfg.Provider))
	if provider == "" {
		provider = "gemini"
	}

	switch provider {
	case "openai":
		return c.callOpenAICompatible(ctx, cfg, "https://api.openai.com/v1/chat/completions", systemInstruction, promptText)
	case "deepseek":
		endpoint := cfg.BaseUrl
		if endpoint == "" {
			endpoint = "https://api.deepseek.com/chat/completions"
		} else if !strings.HasSuffix(endpoint, "/chat/completions") {
			endpoint = strings.TrimRight(endpoint, "/") + "/chat/completions"
		}
		return c.callOpenAICompatible(ctx, cfg, endpoint, systemInstruction, promptText)
	case "glm":
		endpoint := cfg.BaseUrl
		if endpoint == "" {
			endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
		} else if !strings.HasSuffix(endpoint, "/chat/completions") {
			endpoint = strings.TrimRight(endpoint, "/") + "/chat/completions"
		}
		return c.callOpenAICompatible(ctx, cfg, endpoint, systemInstruction, promptText)
	case "custom":
		endpoint := cfg.BaseUrl
		if endpoint == "" {
			endpoint = "http://localhost:11434/v1/chat/completions"
		} else if !strings.HasSuffix(endpoint, "/chat/completions") {
			endpoint = strings.TrimRight(endpoint, "/") + "/chat/completions"
		}
		return c.callOpenAICompatible(ctx, cfg, endpoint, systemInstruction, promptText)
	case "claude":
		return c.callAnthropicClaude(ctx, cfg, systemInstruction, promptText)
	case "gemini":
		fallthrough
	default:
		return c.callGoogleGemini(ctx, cfg, systemInstruction, promptText)
	}
}

// callGoogleGemini calls Google AI Gemini REST API
func (c *Client) callGoogleGemini(ctx context.Context, cfg db.ModelConfig, systemInstruction, promptText string) (string, error) {
	if cfg.ApiKey == "" {
		return "", fmt.Errorf("Google Gemini API Key belum diatur di pengaturan")
	}

	model := cfg.Model
	if model == "" {
		model = "gemini-2.5-flash"
	}
	model = strings.TrimPrefix(model, "googleai/")

	endpoint := cfg.BaseUrl
	if endpoint == "" {
		endpoint = fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, cfg.ApiKey)
	} else if !strings.Contains(endpoint, "key=") {
		endpoint = fmt.Sprintf("%s?key=%s", strings.TrimRight(endpoint, "?&"), cfg.ApiKey)
	}

	type part struct {
		Text string `json:"text"`
	}
	type content struct {
		Role  string `json:"role,omitempty"`
		Parts []part `json:"parts"`
	}
	type geminiReq struct {
		SystemInstruction *content `json:"system_instruction,omitempty"`
		Contents          []content `json:"contents"`
		GenerationConfig  struct {
			Temperature     float64 `json:"temperature,omitempty"`
			MaxOutputTokens int     `json:"maxOutputTokens,omitempty"`
		} `json:"generationConfig,omitempty"`
	}

	reqBody := geminiReq{
		Contents: []content{
			{
				Role:  "user",
				Parts: []part{{Text: promptText}},
			},
		},
	}
	if systemInstruction != "" {
		reqBody.SystemInstruction = &content{
			Parts: []part{{Text: systemInstruction}},
		}
	}
	if cfg.Temperature > 0 {
		reqBody.GenerationConfig.Temperature = cfg.Temperature
	}
	if cfg.MaxTokens > 0 {
		reqBody.GenerationConfig.MaxOutputTokens = cfg.MaxTokens
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", endpoint, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("gagal menghubungi Gemini API: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("Gemini API Error (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	var resData struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(bodyBytes, &resData); err != nil {
		return "", fmt.Errorf("gagal membaca respons Gemini: %w", err)
	}

	if len(resData.Candidates) == 0 || len(resData.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("tidak ada respons yang dihasilkan oleh model")
	}

	var sb strings.Builder
	for _, p := range resData.Candidates[0].Content.Parts {
		sb.WriteString(p.Text)
	}
	return strings.TrimSpace(sb.String()), nil
}

// callOpenAICompatible handles standard OpenAI chat completions format
func (c *Client) callOpenAICompatible(ctx context.Context, cfg db.ModelConfig, endpoint, systemInstruction, promptText string) (string, error) {
	if cfg.ApiKey == "" && !strings.Contains(endpoint, "localhost") {
		return "", fmt.Errorf("API Key untuk %s belum diatur di pengaturan", cfg.Provider)
	}

	model := cfg.Model
	if model == "" {
		switch strings.ToLower(cfg.Provider) {
		case "deepseek":
			model = "deepseek-chat"
		case "glm":
			model = "glm-4-flash"
		default:
			model = "gpt-4o-mini"
		}
	}

	type message struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	}
	type chatReq struct {
		Model       string    `json:"model"`
		Messages    []message `json:"messages"`
		Temperature float64   `json:"temperature,omitempty"`
		MaxTokens   int       `json:"max_tokens,omitempty"`
	}

	messages := make([]message, 0, 2)
	if systemInstruction != "" {
		messages = append(messages, message{Role: "system", Content: systemInstruction})
	}
	messages = append(messages, message{Role: "user", Content: promptText})

	reqBody := chatReq{
		Model:    model,
		Messages: messages,
	}
	if cfg.Temperature > 0 {
		reqBody.Temperature = cfg.Temperature
	}
	if cfg.MaxTokens > 0 {
		reqBody.MaxTokens = cfg.MaxTokens
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", endpoint, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	if cfg.ApiKey != "" {
		req.Header.Set("Authorization", "Bearer "+cfg.ApiKey)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("gagal menghubungi %s API: %w", cfg.Provider, err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("%s API Error (%d): %s", cfg.Provider, resp.StatusCode, string(bodyBytes))
	}

	var resData struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(bodyBytes, &resData); err != nil {
		return "", fmt.Errorf("gagal membaca respons %s: %w", cfg.Provider, err)
	}

	if len(resData.Choices) == 0 {
		return "", fmt.Errorf("tidak ada respons yang dihasilkan oleh model %s", cfg.Provider)
	}

	return strings.TrimSpace(resData.Choices[0].Message.Content), nil
}

// callAnthropicClaude calls Anthropic Claude API
func (c *Client) callAnthropicClaude(ctx context.Context, cfg db.ModelConfig, systemInstruction, promptText string) (string, error) {
	if cfg.ApiKey == "" {
		return "", fmt.Errorf("Anthropic Claude API Key belum diatur di pengaturan")
	}

	model := cfg.Model
	if model == "" {
		model = "claude-3-7-sonnet-20250219"
	}

	endpoint := cfg.BaseUrl
	if endpoint == "" {
		endpoint = "https://api.anthropic.com/v1/messages"
	}

	maxTokens := cfg.MaxTokens
	if maxTokens <= 0 {
		maxTokens = 2048
	}

	type message struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	}
	type claudeReq struct {
		Model     string    `json:"model"`
		MaxTokens int       `json:"max_tokens"`
		System    string    `json:"system,omitempty"`
		Messages  []message `json:"messages"`
	}

	reqBody := claudeReq{
		Model:     model,
		MaxTokens: maxTokens,
		System:    systemInstruction,
		Messages: []message{
			{Role: "user", Content: promptText},
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", endpoint, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", cfg.ApiKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("gagal menghubungi Claude API: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("Claude API Error (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	var resData struct {
		Content []struct {
			Type string `json:"type"`
			Text string `json:"text"`
		} `json:"content"`
	}

	if err := json.Unmarshal(bodyBytes, &resData); err != nil {
		return "", fmt.Errorf("gagal membaca respons Claude: %w", err)
	}

	var sb strings.Builder
	for _, item := range resData.Content {
		if item.Type == "text" {
			sb.WriteString(item.Text)
		}
	}

	res := strings.TrimSpace(sb.String())
	if res == "" {
		return "", fmt.Errorf("tidak ada teks yang dihasilkan oleh model Claude")
	}
	return res, nil
}
