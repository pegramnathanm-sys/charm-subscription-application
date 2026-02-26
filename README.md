# Charm

A universal subscription commerce app that lets users discover products from across the internet, purchase them directly, and subscribe for recurring deliveries.

## Product Overview

### What This App Does

Charm enables users to:

- **Discover** and pull product data from online retailers
- **Purchase** products directly inside the app
- **Subscribe** to products for recurring purchases
- **Manage** order history and payment methods

The system leverages:

- **Rye APIs** for product retrieval and checkout orchestration
- **Stripe SDK** for secure payment tokenization and payment intent handling

---

## Core Capabilities

### 1. Universal Product Access

Using Rye's Product API and Checkout API, the app can:

- Pull product metadata from online retailers via URL
- Display structured product information (name, price, images, description)
- Initiate checkout flows programmatically

This allows Charm to act as a **universal commerce layer** across merchants.

### 2. Secure Checkout

The checkout flow:

1. User adds a payment method
2. Stripe SDK tokenizes the card
3. App stores only the Stripe `customer_id` and `payment_method_id`
4. User initiates purchase
5. Backend creates an order via Rye Checkout API with the attached Stripe payment method
6. Stripe processes payment, Rye confirms the order
7. App stores order metadata and payment status

**Security notes:**
- The app never stores raw card numbers
- Stripe handles PCI compliance and authorization
- Only tokenized payment method references are stored

### 3. Recurring Purchases (Subscriptions)

Charm implements scheduled recurring purchases by:

- Storing subscription configurations (frequency, quantity, product ID)
- Running scheduled jobs (cron / worker)
- Re-initiating checkout via Rye using saved Stripe payment methods

**Recurring flow:**

1. Scheduler triggers
2. Backend creates a new Rye checkout
3. Stripe charges the saved payment method
4. Order confirmation is stored in the database
5. User is notified

This enables recurring purchases even for products that **do not natively support subscriptions**.

---

## High-Level Architecture

```
Client App
    |
Stripe SDK (Payment Method Tokenization)
    |
Backend API (Express / Node.js)
    |
Rye Product API ---- Rye Checkout API
    |                      |
    |                 Stripe (Payment Processing)
    |                      |
    +-------> App Database (Orders, Payment Refs, Subscriptions)
```

### Data Stored

| Stored                       | Not Stored              |
|------------------------------|-------------------------|
| Stripe customer ID           | Raw card numbers        |
| Stripe payment method ID     | CVV                     |
| Rye order ID                 | Full expiration details |
| Stripe payment intent ID     |                         |
| Product metadata             |                         |
| Subscription configuration   |                         |
| Order history                |                         |

---

## Project Structure

```
charm-subscription-application/
  .env                       # API keys (gitignored)
  .env.example               # Template for required env vars
  .gitignore
  package.json
  server.js                  # Express server + Rye API proxy
  public/
    index.html               # App shell
    css/
      variables.css          # CSS custom properties, reset, theming
      layout.css             # App shell, sidebar, nav, responsive
      components.css         # Buttons, toggles, badges, qty selector
      buy.css                # Buy view, chat UI, product cards
      subscriptions.css      # Subscription cards, actions
      settings.css           # Settings form, inputs
    js/
      app.js                 # Entry point, wires up all modules
      navigation.js          # View switching, sidebar, hamburger menu
      chat.js                # Chat bubble rendering, typing indicator
      products.js            # Product lookup via Rye API, product cards
      subscriptions.js       # Subscription state, CRUD, rendering
      settings.js            # Dark mode toggle, settings persistence
      utils.js               # escHtml, showToast, formatPrice, helpers
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Rye](https://www.rye.com/) API key

### Setup

```bash
# Clone the repo
git clone https://github.com/pegramnathanm-sys/charm-subscription-application.git
cd charm-subscription-application

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your RYE_API_KEY
```

### Run

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Key Benefits

- **Universal commerce** — purchase from any supported retailer via URL
- **PCI-minimized architecture** — no raw card data touches the server
- **Extensible subscription layer** — recurring purchases for any product
- **Modular payment orchestration** — Stripe + Rye decoupled cleanly
- **Marketplace-ready foundation** — multi-merchant by design

## Future Enhancements

- Subscription management UI improvements
- Smart reorder logic (inventory-aware)
- Price change monitoring
- Failed payment retry logic
- Refund and dispute handling
- Multi-merchant analytics

---

## LLM Quickstart

> Instructions for AI coding agents (Claude Code, Cursor, Copilot, etc.) working on this project.

### Git Workflow

**Every feature, bug fix, or change gets its own branch.** Do not commit directly to `main`.

```bash
# Create a feature branch off main
git checkout main
git pull origin main
git checkout -b feature/short-description

# When done, push and open a PR
git push -u origin feature/short-description
gh pr create --base main
```

- **Branch naming:** `feature/`, `fix/`, or `refactor/` prefix + short kebab-case description (e.g. `feature/stripe-checkout`, `fix/dark-mode-shimmer`)
- **One concern per branch.** Don't bundle unrelated changes.
- **Never force-push to `main`.** Never commit directly to `main`.
- **Open a PR** for all changes so they can be reviewed before merging.

### Tech Stack

- **Backend:** Node.js + Express, no TypeScript
- **Frontend:** Vanilla JS (ES modules), no frameworks, no bundler
- **Styling:** Plain CSS with CSS custom properties for theming — no Sass/Tailwind
- **APIs:** Rye (product/checkout), Stripe (payments)
- **Package manager:** npm

### Project Conventions

- **No `.env` in commits.** API keys and secrets go in `.env` (gitignored). Use `.env.example` as the template.
- **CSS theming:** All colors must use CSS variables defined in `public/css/variables.css`. Both `:root` (light) and `[data-theme="dark"]` blocks must be updated when adding new colors. Never hardcode color values in component CSS files.
- **CSS file organization:** Styles are split by concern — don't put layout styles in `components.css` or component styles in `buy.css`. Match the existing pattern:
  - `variables.css` — design tokens, reset, base styles
  - `layout.css` — app shell, sidebar, nav, responsive breakpoints
  - `components.css` — shared UI (buttons, toggles, badges, qty selector, toast)
  - `buy.css` — buy view, chat, product cards, input bar
  - `subscriptions.css` — subscription list and cards
  - `settings.css` — settings form and inputs
- **JS module organization:** Each module has a clear responsibility. Entry point is `app.js` which calls `init*()` from each module. Don't create circular imports.
  - `app.js` — entry point, imports and initializes everything
  - `navigation.js` — sidebar, view switching, hamburger menu
  - `chat.js` — chat bubble DOM helpers
  - `products.js` — product lookup API calls, product card rendering
  - `subscriptions.js` — subscription state array, CRUD, card rendering
  - `settings.js` — dark mode toggle, settings persistence
  - `utils.js` — pure utility functions (escHtml, showToast, formatPrice, etc.)
- **Event handling:** Use event delegation on parent containers for dynamically created elements. Use `data-action` and `data-id` attributes instead of inline `onclick` handlers.
- **SVG icons:** Use `currentColor` for stroke/fill so icons inherit theme colors. Never hardcode color values in SVGs.
- **HTML:** The app is a single-page app with view switching (not routing). Views are `div.view` elements toggled by `display: none`.

### Server

- `server.js` is the only backend file. It serves static files from `public/` and proxies API calls to Rye.
- The API key is read from `process.env.RYE_API_KEY` — never expose it to the client.
- To add a new API route, follow the existing pattern in `server.js` (proxy to external service, return JSON).

### Running Locally

```bash
npm install
cp .env.example .env   # then add your RYE_API_KEY
npm run dev             # starts on http://localhost:3000 with auto-restart
```

> **Note:** A Rye API key is required to test the product lookup feature. Without one, the app still runs and all other features work (subscriptions, settings, dark mode, navigation), but pasting a product URL will fail. Contact a project maintainer for a key if you need to test product lookup.

### Before Submitting a PR

- Verify the app loads without console errors or 404s
- Test both light and dark mode if you touched any CSS
- Test mobile view (hamburger menu, sidebar) if you touched layout
- Make sure no API keys or secrets are in any `public/` file
- Keep commits focused with clear messages
