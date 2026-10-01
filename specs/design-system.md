# Design System & UI/UX Standards

Periodus adheres to a strict design token architecture using **Chakra UI v3** with semantic color scales and layer styles.

---

## 1. Design Token Philosophy

1. **No Arbitrary Hex Colors in Components**:
   * Never hardcode hex values like `#121212` or `rgb(...)` in JSX attributes.
   * Always reference semantic tokens:
     * Surface/Background: `bg="bg.canvas"`, `bg="bg.panel"`, `bg="bg.subtle"`, `bg="bg.muted"`
     * Foreground/Text: `color="fg"`, `color="fg.muted"`, `color="fg.subtle"`
     * Borders: `borderColor="border.subtle"`, `borderColor="border.muted"`
2. **Color Palette Hierarchy (Radix Colors Scale)**:
   * **Ruby (`ruby`)**: Primary brand identity, active tabs, CTA buttons, focus states, interactive highlights.
   * **Gray (`gray`)**: Neutral UI framing, secondary buttons, subtle borders, background fills.
   * **Amber (`amber`)**: Summary chips, cautionary alerts, warm reading accents.
   * **Teal (`teal`)**: Vocabulary & lexical tools, dictionary lookup tags.
   * **Indigo (`indigo`)**: Literary critique, structural analysis badges.
3. **Layer Styles (`ui/src/theme/layer-styles.ts`)**:
   * `glassHeader`: Frosted glass background with backdrop blur (`backdropFilter: 'blur(12px)'`, translucent border) for window titlebars and sticky navigation.
   * `glassCard`: Translucent floating panels with subtle depth and border contrast.
   * `readerContent`: Optimized reading margins, leading, and proportional max widths.

---

## 2. Desktop Window & Titlebar Rules

Periodus runs in a frameless window configuration. The window controls and draggable zones must follow these rules:

1. **Top Bar as Window Titlebar**:
   * The top-most header in any view (`IndexRoute`, `ReaderRoute`, `SettingsLayoutRoute`) acts as the native window titlebar.
   * The container must include:
     ```tsx
     style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
     ```
   * All clickable elements (Back buttons, Tabs, Search inputs, Actions, Theme toggles, and Window Controls) must be wrapped with:
     ```tsx
     style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
     ```
2. **Page Content Under the Titlebar**:
   * The titlebar must never be replaced with general page text.
   * Page titles (e.g. *"Preferences & Settings"*, subtitles, descriptions) belong **underneath the titlebar** within the main scrollable or viewport area.
3. **Window Controls Component**:
   * Always include `<WindowControls />` on the far right of the top-level bar.

---

## 3. Typography Scale & Fonts

The reading experience supports six curated font families:
- **Literata** (`book-serif`): Designed for digital books, high legibility in dense text.
- **Newsreader** (`editorial-serif`): Elegant literary proportions with classic cadence.
- **Fraunces** (`display-serif`): Warm, characterful serif with subtle baroque curves.
- **Plus Jakarta Sans** (`modern-sans`): Clean, modern sans-serif for UI and utilitarian reading.
- **JetBrains Mono** (`monospace`): Code, poetry meter, and structural breakdown.
- **Georgia** (`classic-serif`): Universal, timeless reading fallback.

Text styles are standardized via `ui/src/theme/text-styles.ts` (`display`, `title`, `body`, `caption`, `readingText`).
