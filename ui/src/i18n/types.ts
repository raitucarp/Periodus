export type Locale = 'id' | 'en'

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
  }
}
