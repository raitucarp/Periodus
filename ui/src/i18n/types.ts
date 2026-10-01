export type Locale = 'en' | 'id' | 'fr' | 'de' | 'la' | 'nl' | 'es' | 'ja'

export interface LocaleMeta {
  code: Locale
  label: string
  nativeName: string
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', nativeName: 'English (EN)' },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia (ID)' },
  { code: 'fr', label: 'French', nativeName: 'Français (FR)' },
  { code: 'de', label: 'German', nativeName: 'Deutsch (DE)' },
  { code: 'es', label: 'Spanish', nativeName: 'Español (ES)' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands (NL)' },
  { code: 'la', label: 'Latin', nativeName: 'Lingua Latina (LA)' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語 (JA)' },
]

export interface TranslationSchema {
  app: {
    title: string
    subtitle: string
    loadingLibrary: string
  }
  header: {
    importButton: string
    importingButton: string
    settingsTitle: string
    languageLabel: string
    themeToggleLabel: string
  }
  emptyState: {
    title: string
    description: string
    importAction: string
    importingAction: string
  }
  library: {
    searchPlaceholder: string
    totalBooksCount: string
    continueReadingHeading: string
    allBooksHeading: string
    noBooksFound: string
    unknownAuthor: string
    paragraphsCount: string
    deleteBookConfirm: string
    deleteButtonAria: string
  }
  reader: {
    backToCatalog: string
    chapterLabel: string
    chapterOption: string
    paragraphCountLabel: string
    paragraphOfTotal: string
    percentCompleted: string
    navPrevious: string
    navNext: string
    keyboardHint: string
    loadingContent: string
  }
  aiPanel: {
    heading: string
    badge: string
    explainBtn: string
    summarizeBtn: string
    vocabularyBtn: string
    analyzingState: string
    problemHeading: string
    openSettingsBtn: string
    emptyTitle: string
    emptyDescription: string
    resultBadge: string
    emptyParagraphError: string
    missingKeyError: string
  }
  settings: {
    title: string
    description: string
    apiKeyLabel: string
    apiKeyPlaceholder: string
    savedSuccess: string
    cancelBtn: string
    saveBtn: string
    savingBtn: string
    languageSelection: string
    themeSelection: string
    themeDark: string
    themeLight: string
    tabGeneral: string
    tabReader: string
    tabAI: string
    aiSubTabChat: string
    aiSubTabEmbedding: string
    aiSubTabVision: string
    aiSubTabPrompts: string
    scopeLabel: string
    scopeGlobal: string
    useGlobalConfig: string
    providerLabel: string
    modelLabel: string
    baseUrlLabel: string
    baseUrlPlaceholder: string
    tempLabel: string
    maxTokensLabel: string
    dimensionsLabel: string
    fontFamilyLabel: string
    fontSizeLabel: string
    lineHeightLabel: string
    maxWidthLabel: string
    textAlignLabel: string
    previewTitle: string
    previewText: string
    addPromptBtn: string
    editPromptBtn: string
    deletePromptBtn: string
    resetPromptsBtn: string
    promptNameLabel: string
    promptActionLabel: string
    promptSystemLabel: string
    promptTemplateLabel: string
    promptDescLabel: string
  }
}
