# Periodus Specifications & Engineering Guidelines

Welcome to the **Periodus** architecture, engineering standards, and codebase specification repository.

Periodus is a local-first, privacy-focused desktop EPUB reader built for deep comprehension, paragraph-by-paragraph immersion, contextual AI text analysis, and offline dictionary lookup.

---

## 📑 Specification Index

| Document | Description |
| :--- | :--- |
| **[`architecture.md`](./architecture.md)** | System overview, technology stack, data flow, Wails v3 bridge, SQLite + `sqlc`, and local vector search. |
| **[`coding-style.md`](./coding-style.md)** | Mandatory conventions, named function patterns, `ts-pattern` state machines, strict typing, and Go guidelines. |
| **[`design-system.md`](./design-system.md)** | Chakra UI v3 semantic design tokens, color palettes, typography scale, glassmorphism, and ambient visual rules. |
| **[`structure.md`](./structure.md)** | Full repository anatomy, directory hierarchies, file-based routing, TanStack Query separation, and backend packages. |
| **[`database-and-ai.md`](./database-and-ai.md)** | SQLite schema, `sqlc` queries & seeding, additive migrations, multi-provider AI (Chat, Vision, Embeddings), and dynamic prompts. |

---

## 🎯 Core Technical Tenets

1. **Local-First & Zero-Cloud Dependency for Reading**:
   * Books, reading positions, WordNet dictionary, and prompt databases exist entirely on the local machine (`%APPDATA%/Periodus/` on Windows).
2. **Strict SQL Hygiene with `sqlc`**:
   * **Zero raw SQL in `.go` files**. All database operations, tables, and seeding scripts are strictly defined in `internal/db/*.sql` and compiled into type-safe Go code.
3. **Additive Schema Evolution**:
   * Existing local databases automatically migrate missing columns via `migrateSchema()` without data loss.
4. **Predictable State & Named Function Style**:
   * No anonymous arrow functions in effects or complex hooks. Pattern matching with `ts-pattern` ensures compile-time exhaustive UI state handling.
5. **Modern File-Based Routing**:
   * Powered by `@tanstack/react-router` and `@tanstack/react-query` for decoupled, measured UI transitions and reliable server synchronization.
