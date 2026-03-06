# MBST Phone Catalog

A mobile phone catalog SPA for browsing, searching, and purchasing smartphones. Built with Next.js 14 (App Router), TypeScript, and Clean Architecture principles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) — SSR + CSR |
| Language | TypeScript 5 |
| Styling | SASS Modules + CSS Custom Properties |
| State Management | React Context API + localStorage |
| Testing | Jest 30 + React Testing Library |
| Linting / Formatting | ESLint (jsx-a11y) + Prettier |
| Runtime | Node.js >= 18 |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://api-url.com
NEXT_PUBLIC_API_KEY=XXXXXXXXXXXXXXXXXXXXX
```

### Run in Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server runs with unminified assets and source maps.

### Production Build

```bash
pnpm build
pnpm start
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create optimised production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format source files with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm test` | Run the full test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests and generate coverage report |

---

## Architecture

The project follows **Clean Architecture** organised in four layers with strict dependency direction: `domain ← infrastructure ← application ← presentation`.

```
public/                 # Static assets
src/
  domain/               # Core business entities & contracts — zero external dependencies
    models/             # TypeScript interfaces: Product, CartItem
    repositories/       # Repository interface contracts (ProductRepository)

  infrastructure/       # Adapters for the outside world
    api/                # Centralised HTTP client (x-api-key injected here)
    storage/            # localStorage adapter for cart persistence

  application/          # Use-case logic as custom React hooks
    hooks/              # useProducts, useCart, useSearch

  presentation/         # All UI concerns
    components/
      ui/               # Generic, reusable components (SearchBar, Badge, ResultsCount)
      layout/           # Structural components (Navbar, PageLayout)
      product/          # Product-specific components (ProductCard, ProductGrid)
    context/            # React Context providers (CartContext)

  lib/                  # Shared constants and utility functions
  styles/               # Global SASS variables, reset, and mixins
  app/                  # Next.js App Router pages (/, /product/[id], /cart)
```

### SOLID Principles

- **Single Responsibility** — Each module has exactly one concern (e.g. `httpClient` only handles HTTP transport; `ProductCard` only renders a card).
- **Open/Closed** — The repository pattern lets new data sources be added without touching consumers.
- **Liskov Substitution** — `ProductApiRepository` can be replaced by any class that implements `ProductRepository`.
- **Interface Segregation** — `ProductSummary` (list views) is kept separate from `ProductDetail` (detail view) to avoid exposing unnecessary fields.
- **Dependency Inversion** — Application hooks depend on repository interfaces, not on concrete API implementations.

### API Communication

All HTTP calls are centralised in `src/infrastructure/api/`. The `x-api-key` header is injected once inside `httpClient.ts` and is never duplicated across the codebase.

### Cart Persistence

`CartContext` is initialised with data from `localStorage` and syncs every state change back via `useEffect`, providing seamless persistence across page reloads.

---

## Views

| Route | Description |
|-------|-------------|
| `/` | Phone list — responsive grid, real-time search, results count |
| `/product/[id]` | Phone detail — colour/storage selectors, dynamic price, add to cart |
| `/cart` | Shopping cart — item list, total price, per-item delete |

---

## Responsive Design

- **Mobile** — < 768 px (single column)
- **Tablet** — 768 px – 1279 px (two columns)
- **Desktop** — ≥ 1280 px (five columns)
- Font: `Helvetica, Arial, sans-serif`
- Theming via CSS Custom Properties (`--color-primary`, `--spacing-md`, …)

---

## Testing

Tests are colocated next to their components (`*.test.tsx`). The suite covers:

- **Unit tests** — CartContext logic (add, remove, persistence)
- **Integration tests** — Search flow with mocked API responses
- **Component tests** — Accessibility roles and user interactions via React Testing Library
