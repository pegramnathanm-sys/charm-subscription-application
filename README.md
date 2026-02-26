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
