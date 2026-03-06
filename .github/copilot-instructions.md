# Copilot Instructions — Zara Mobile Catalog Challenge

## Project Overview
A mobile phone catalog SPA with browse, search, detail, and cart functionality. Built with React, using React Context API for state management and localStorage for cart persistence.

## Tech Stack
- **Frontend**: React >= 17, SASS or CSS variables (optional: Next.js for SSR)
- **Runtime**: Node 18
- **State**: React Context API only — no Redux, Zustand, or other libraries
- **Styling**: SASS or StyledComponents; font-family must be `Helvetica, Arial, sans-serif`
- **Testing**: Jest + React Testing Library
- **Linting/Formatting**: ESLint + Prettier

## Project Structure
```
src/
  api/           # All fetch calls — always attach x-api-key header here
  components/    # Shared UI components (Navbar, PhoneCard, etc.)
  context/       # CartContext (persistent via localStorage)
  pages/         # PhoneList, PhoneDetail, Cart
  hooks/         # Custom hooks (usePhones, useCart, useSearch)
  styles/        # Global SASS variables and resets
```

## API Authentication
Every request **must** include this header — never omit it:
```js
headers: { 'x-api-key': '87909682e6cd74208f41a6ef39fe4191' }
```
Centralise all fetch logic in `src/api/` so the key is never scattered across components.

## Three Views & Key Behaviours

### 1. `PhoneList` (`/`)
- Renders a grid of the first 20 phones from the API
- Each card shows: image, name, brand, base price
- Real-time search by name/brand **must call the API** (not client-side filtering)
- Search bar shows result count
- Clicking a card navigates to `/phone/:id`

### 2. `PhoneDetail` (`/phone/:id`)
- Image updates dynamically when user selects a different colour
- Storage and colour selectors update the displayed price in real time
- "Add to Cart" button is **disabled** until both colour and storage are selected
- Shows a "Similar Products" section at the bottom

### 3. `Cart` (`/cart`)
- Lists items with image, name, selected storage/colour, and individual price
- Shows total price; individual delete buttons per item
- "Continue shopping" button navigates back to `/`

## Cart State (CartContext)
- Backed by `localStorage` — rehydrate on context initialisation:
  ```js
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('cart') ?? '[]')
  );
  ```
- Sync to `localStorage` on every state change via `useEffect`
- Navbar icon always reflects live item count from context

## Navbar (present on all views)
- Home icon → links to `/`
- Cart icon → displays current cart item count badge

## Responsive Design
- Mobile-first; follow the provided Figma designs
- Use CSS custom properties (`--color-primary`, `--spacing-md`, etc.) for theming

## Dev / Prod Modes
| Mode | Command | Assets |
|------|---------|--------|
| Development | `npm run dev` | Unminified, source maps |
| Production | `npm run build` | Concatenated & minified |

## Testing Conventions
- Unit tests for Context (cart add/remove/persist)
- Integration tests for search flow (mock API responses)
- Component tests assert accessibility roles, not just DOM nodes

## Accessibility Requirements
- All interactive elements must have ARIA labels or visible text
- Colour selectors must not rely on colour alone (add `aria-label` with colour name)
- Console must be **free of errors and warnings** — treat warnings as errors

## Linting & Formatting
- ESLint with `eslint-plugin-react`, `eslint-plugin-jsx-a11y`
- Prettier for formatting; both should run as pre-commit hooks via `lint-staged`
