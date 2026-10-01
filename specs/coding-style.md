# Coding Style & Best Practices Guide

This document establishes the mandatory conventions and engineering standards for all contributions to the Periodus codebase.

---

## 1. TypeScript & React Guidelines

### 1.1 Named Functions for Callbacks & Effects
To ensure crystal-clear stack traces, superior maintainability, and self-documenting code, **always use named function declarations** instead of anonymous inline arrow functions for:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React lifecycle hooks (`useEffect`, `useCallback`, `useMemo`)
- Array functional transformations (`.map()`, `.filter()`, `.reduce()`)
- Query / Mutation definitions (`queryFn`, `mutationFn`, `onSuccess`)

#### ✅ Correct:
```tsx
useEffect(function loadBookChapters() {
  async function performFetch() {
    // ...
  }
  performFetch()
}, [bookId])

return (
  <VStack>
    {books.map(function renderBookItem(book) {
      return <BookCard key={book.id} book={book} onSelect={handleBookSelect} />
    })}
  </VStack>
)
```

#### ❌ Incorrect:
```tsx
useEffect(() => {
  // Anonymous effect
}, [bookId])

return (
  <VStack>
    {books.map(book => <BookCard key={book.id} book={book} />)}
  </VStack>
)
```

---

### 1.2 Exhaustive State Pattern Matching with `ts-pattern`
Do not use deeply nested ternary operators or unverified `switch` statements for multi-state views. Use `ts-pattern`'s `match().with().exhaustive()` to guarantee compile-time coverage of all possible states.

```tsx
type ViewState = 'loading' | 'empty' | 'error' | 'ready'

const renderedContent = match(viewState)
  .with('loading', function renderLoading() {
    return <LoadingIndicator />
  })
  .with('empty', function renderEmpty() {
    return <EmptyPlaceholder onAction={handleImport} />
  })
  .with('error', function renderError() {
    return <ErrorBanner error={error} onRetry={handleRetry} />
  })
  .with('ready', function renderReady() {
    return <BookGrid items={data} />
  })
  .exhaustive()
```

---

### 1.3 Strict Component Typing & Prop Interfaces
Every reusable component must export an explicit TypeScript interface defining its contract. Do not use `any` or implicit typing.

```tsx
export interface PromptCardProps {
  prompt: Prompt
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onToggle: (id: string, isEnabled: boolean) => void
}

export function PromptCard({ prompt, onEdit, onDelete, onToggle }: PromptCardProps) {
  // ...
}
```

---

### 1.4 TanStack Query Integration Pattern
Never fetch data or trigger mutations directly in component render bodies. All backend calls must flow through dedicated query/mutation hooks with centralized `queryKeys`.

```tsx
// ui/src/queries/useBooksQueries.ts
export function useBooksQuery() {
  return useQuery<Book[]>({
    queryKey: queryKeys.books.all,
    queryFn: async function fetchBooks() {
      return await BookService.getBooks()
    },
  })
}
```

---

## 2. Go Backend Guidelines

### 2.1 Pure SQL and `sqlc` (Zero Raw SQL in Go Code)
1. **Never write raw SQL queries** inside `.go` files (e.g. `db.Exec("SELECT ... FROM ...")`).
2. All tables, indexes, constraints, and initial data definitions belong in `internal/db/schema.sql`.
3. All query operations belong in `internal/db/queries.sql`.
4. Run `task generate` (or `sqlc generate`) to create strongly typed models and queriers.
5. Repository methods must simply wrap `r.queries.<MethodName>(ctx, ...)`.

```go
// ✅ Correct - internal/db/prompt_queries.go
func (r *Repository) GetPrompts(ctx context.Context, bookID string) ([]Prompt, error) {
    return r.queries.ListPrompts(ctx, bookID)
}
```

---

### 2.2 Additive Schema Migration & Backward Compatibility
Because SQLite databases reside on user machines (`%APPDATA%/Periodus/periodus.db`), adding a new column to `schema.sql` does not update existing tables when using `CREATE TABLE IF NOT EXISTS`.
- Always inspect table metadata via `PRAGMA table_info(...)` in `internal/db/migration.go`.
- Conditionally apply `ALTER TABLE ... ADD COLUMN ...` with appropriate defaults.
- Always provide a dedicated unit test in `repository_test.go` verifying legacy migration.

---

### 2.3 Idiomatic Go Error Handling
- Always wrap errors with descriptive context using `fmt.Errorf("context: %w", err)`.
- Use `context.Context` as the first argument in all service and database methods.
- Check and handle `sql.ErrNoRows` gracefully (return `nil, nil` for optional entity lookups).

```go
func (s *BookService) GetBook(ctx context.Context, id string) (*db.Book, error) {
    book, err := s.repo.GetBook(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("fetch book %q: %w", id, err)
    }
    return book, nil
}
```

---

## 3. Formatting & Linting Commands
Before submitting changes or building:
```pwsh
# 1. Run backend unit tests
go test -v ./internal/...

# 2. Check frontend linting
cd ui
npm run lint

# 3. Verify frontend build
npm run build

# 4. Build desktop binary
cd ..
wails3 build
```
