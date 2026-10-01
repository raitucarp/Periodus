# System Architecture & Technical Stack

## 1. High-Level Overview

Periodus is structured as a hybrid desktop application utilizing **Wails v3** as the native host bridge, linking a modern **Go (v1.23+)** runtime backend with a **React 19 + TypeScript** frontend bundled via **Vite / Rolldown**.

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (React 19 + TypeScript)"]
        UI[Chakra UI v3 + Design Tokens]
        Router[TanStack Router (File-Based Routes)]
        Query[TanStack Query (Cache & Mutate)]
        i18n[i18n 7 Locales: EN, ID, FR, DE, LA, NL, ES, JA]
        Bindings[Auto-generated Wails TS Bindings]
    end

    subgraph WailsBridge ["Wails v3 Native IPC Bridge"]
        IPC[Direct Go Struct & Method RPC]
        Windowing[Frameless Drag Titlebar & Native Window Controls]
    end

    subgraph Backend ["Backend Runtime (Go 1.23+)"]
        Main[main.go / Application Lifecycle]
        Services[Service Layer: Book, Reader, AI, Settings, Dictionary]
        Repo[Repository Layer / SQLite DB Manager]
        Ext[EPUB Extractor + OpenLibrary Client]
        LLM[Genkit & Multi-Provider AI Engine]
    end

    subgraph Storage ["Local Storage & SQLite"]
        SQLite[(periodus.db SQLite3 + WAL)]
        VecExt[sqlite-vec Native Extension]
        WordNet[(Embedded Princeton WordNet Dictionary)]
        FileSystem[Books EPUB & Covers Storage]
    end

    Router --> Query
    Query --> Bindings
    Bindings --> IPC
    IPC --> Services
    Services --> Repo
    Repo --> SQLite
    Repo --> VecExt
    Services --> Ext
    Services --> LLM
    Services --> WordNet
    Ext --> FileSystem
```

---

## 2. Technology Stack

### Backend
- **Go 1.23+**: Robust system language powering business logic, extraction, and database management.
- **Wails v3 (`github.com/wailsapp/wails/v3`)**: Lightweight desktop wrapper utilizing native OS webview (WebView2 on Windows).
- **SQLite 3 via `github.com/ncruces/go-sqlite3`**: Pure WASM/wazero embedded SQLite engine with WAL mode and foreign keys enabled.
- **Vector Search (`github.com/asg017/sqlite-vec-go-bindings`)**: Fast, in-process semantic vector similarity search via `sqlite-vec`.
- **`sqlc` (v1.27+)**: Generates type-safe Go structs and querier methods from pure SQL queries without ORM bloat.
- **Firebase Genkit (`github.com/firebase/genkit/go`)**: Multi-provider generative AI abstraction layer (Google Gemini, OpenAI, Claude, DeepSeek, GLM, Ollama/Custom).
- **Gown (`github.com/donomii/gown`)**: Fast in-memory English WordNet lexical database for offline dictionary lookup.

### Frontend
- **React 19 & TypeScript 5**: Strict functional component architecture.
- **Chakra UI v3**: Semantic design-token-driven component library with Radix Colors scales (`ruby`, `gray`, `amber`, `teal`, `indigo`).
- **TanStack Router (`@tanstack/react-router`)**: Fully type-safe, file-based client-side routing with automatic route generation.
- **TanStack Query (`@tanstack/react-query`)**: Declarative server-state synchronization, optimistic caching, and mutation invalidation.
- **`ts-pattern`**: Exhaustive pattern matching for finite-state machine transitions and conditional rendering.
- **Motion (`motion/react`)**: Hardware-accelerated UI transitions and micro-interactions.
- **Lucide Icons (`lucide-react`)**: Clean, consistent icon set.

---

## 3. Communication & Inter-Process Communication (IPC)

1. **Wails v3 TypeScript Bindings**:
   * Services exposed in `main.go` are converted to TypeScript definitions via:
     ```pwsh
     wails3 generate bindings -ts -d ui/src/bindings
     ```
   * Frontend calls backend methods as typed async promises (e.g. `BookService.GetBooks()`).
2. **Unified Data Layer via TanStack Query**:
   * Direct binding calls are encapsulated in query hooks (`ui/src/queries/`).
   * UI components NEVER invoke bindings directly inside `onClick` or `useEffect`; they invoke hooks like `useBooksQuery()`, `useSaveAISettingsMutation()`, etc.
   * Ensures automatic deduplication, loading/error states, and cache consistency across the application.
