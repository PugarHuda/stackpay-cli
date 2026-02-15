# StackPay CLI ⚡

> **Monetize your APIs in 60 seconds with Bitcoin settlement on Stacks**

[![Built for x402](https://img.shields.io/badge/Built%20for-x402%20Stacks%20Challenge-blue)](https://docs.x402stacks.xyz/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![GitHub](https://img.shields.io/badge/GitHub-PugarHuda%2Fstackpay--cli-black?logo=github)](https://github.com/PugarHuda/stackpay-cli)

## 🎯 What is StackPay?

StackPay is a developer CLI tool that lets you monetize **any API** with Bitcoin micropayments in under 60 seconds. Built on the [Stacks](https://stacks.co) blockchain and the [x402 payment protocol](https://docs.x402stacks.xyz/), it provides:

- ⚡️ **60-second setup** — From zero to monetized API
- 🔒 **Bitcoin security** — Settled on Bitcoin via Stacks Layer 2
- 💰 **Micropayments** — Pay-per-call pricing (as low as 0.001 STX)
- 📊 **Real-time analytics** — Monitor revenue & usage in a beautiful dashboard
- 🔧 **Developer-first** — Beautiful CLI with Express & Fastify templates
- 🏦 **Smart contract escrow** — Clarity-based escrow for secure payments

## 🚀 Quick Start

```bash
# Install StackPay CLI
npm install -g stackpay-cli

# Create a new monetized API
stackpay init my-api

# Navigate and install
cd my-api
npm install

# Configure pricing
stackpay config --price 0.01 --currency STX --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Start your API
stackpay dev
```

Your API is now live with Bitcoin micropayments! 🎉

## 📦 Project Structure

```
stackpay/
├── packages/
│   ├── cli/              # StackPay CLI (oclif-based)
│   │   ├── src/commands/ # CLI commands (init, config, dev, deploy, status)
│   │   └── templates/    # Express & Fastify project templates
│   ├── sdk/              # Payment verification SDK
│   │   └── src/          # PaymentHandler, middleware, x402 integration
│   └── dashboard/        # React revenue dashboard
│       └── src/          # Charts, metrics, transaction views
├── contracts/            # Clarity smart contracts
│   └── escrow.clar       # Payment escrow & revenue management
├── examples/             # Working example APIs
│   ├── weather-api/      # Weather data API
│   ├── stock-api/        # Stock & crypto price API
│   └── ai-text-api/      # AI text analysis API
└── docs/                 # Documentation
```

## 🛠 CLI Commands

| Command | Description |
|---------|-------------|
| `stackpay init <name>` | Create a new monetized API project |
| `stackpay config` | Configure pricing, currency, and payment address |
| `stackpay dev` | Start local development server |
| `stackpay deploy` | Deploy smart contract to Stacks |
| `stackpay status` | Check revenue metrics and balance |

### `stackpay init`

```bash
# Create Express project (default)
stackpay init my-api

# Create Fastify project
stackpay init my-api --template fastify
```

### `stackpay config`

```bash
# Set pricing
stackpay config --price 0.01 --currency STX

# Set payment address
stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Set network
stackpay config --network testnet

# View current configuration
stackpay config --show
```

## 💡 How It Works

### Payment Flow

```
┌──────────┐    1. API Request     ┌──────────────┐
│           │ ──────────────────── │              │
│   API     │    2. HTTP 402       │   StackPay   │
│  Consumer │ ◄─────────────────── │    Server    │
│           │    3. Pay on Stacks  │              │
│           │ ──────────────────── │              │
│           │    4. Send TX proof  │              │
│           │ ──────────────────── │              │
│           │    5. Verify on-chain│              │
│           │    6. Return data    │              │
│           │ ◄─────────────────── │              │
└──────────┘                       └──────────────┘
```

1. Consumer makes an API request
2. Server returns **HTTP 402 Payment Required** with payment instructions
3. Consumer sends STX payment on Stacks blockchain
4. Consumer includes transaction ID in `X-Payment-Proof` header
5. Server verifies payment on-chain via Stacks API
6. Server returns the API response

### x402-stacks Protocol

StackPay implements the [x402-stacks](https://docs.x402stacks.xyz/) payment protocol:

```http
HTTP/1.1 402 Payment Required
WWW-Authenticate: x402-stacks amount=0.01 currency=STX address=SP2J6ZY... network=testnet

{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "protocol": "x402-stacks",
    "amount": 0.01,
    "currency": "STX",
    "recipient": "SP2J6ZY..."
  }
}
```

## 🔐 Smart Contract (Clarity)

The escrow contract provides secure payment handling:

```clarity
;; Lock payment in escrow before API call
(contract-call? .stackpay-escrow lock-payment payment-id recipient amount)

;; Release payment after successful API response
(contract-call? .stackpay-escrow release-payment payment-id)

;; Refund payment if API fails
(contract-call? .stackpay-escrow refund-payment payment-id)
```

**Features:**
- Payment escrow with automatic expiry (144 blocks ≈ 24 hours)
- Per-address revenue statistics
- Contract-level analytics (total payments, revenue, refunds)
- Claim expired unclaimed payments

## 📊 Dashboard

The StackPay Dashboard provides real-time revenue monitoring:

- **Revenue charts** — Track income over time
- **API call metrics** — Monitor usage patterns
- **Transaction history** — View all payment verifications
- **Configuration panel** — Manage pricing and addresses

```bash
# Start the dashboard
cd packages/dashboard
npm run dev
```

## 📂 Example APIs

### 🌤️ Weather API
Real-time weather data from Open-Meteo, monetized at 0.001 STX per call.

```bash
cd examples/weather-api && npm install && npm start
# GET /api/weather?city=tokyo → Current weather
# GET /api/forecast?city=london&days=7 → 7-day forecast
```

### 📈 Stock & Crypto API
Live stock quotes and cryptocurrency prices at 0.005 STX per call.

```bash
cd examples/stock-api && npm install && npm start
# GET /api/stock/AAPL → Apple stock quote
# GET /api/crypto → All crypto prices
```

### 🤖 AI Text API
Text analysis (summarization, sentiment, keywords, translation) at 0.01 STX per call.

```bash
cd examples/ai-text-api && npm install && npm start
# POST /api/summarize → Summarize text
# POST /api/sentiment → Analyze sentiment
# POST /api/keywords → Extract keywords
```

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   StackPay CLI                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ init │ │config│ │ dev  │ │deploy│ │status│ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
├─────────────────────────────────────────────────┤
│                  StackPay SDK                     │
│  ┌──────────────┐  ┌───────────────────────┐    │
│  │PaymentHandler│  │ x402 Payment Middleware│    │
│  └──────────────┘  └───────────────────────┘    │
├───────────────────┬─────────────────────────────┤
│  Stacks.js SDK    │    Clarity Smart Contracts   │
│  ┌─────────────┐  │  ┌───────────────────────┐  │
│  │ Transaction  │  │  │   Escrow Contract     │  │
│  │ Verification │  │  │  - lock-payment       │  │
│  │ Broadcast    │  │  │  - release-payment    │  │
│  └─────────────┘  │  │  - refund-payment     │  │
│                    │  └───────────────────────┘  │
├────────────────────┴─────────────────────────────┤
│              Stacks Blockchain (Bitcoin L2)       │
└──────────────────────────────────────────────────┘
```

## 🔑 Why StackPay vs MoneyMQ (Solana)?

| Feature | StackPay (Stacks) | MoneyMQ (Solana) |
|---------|-------------------|------------------|
| **Settlement** | Bitcoin L1 finality | Solana finality |
| **Security** | Bitcoin-grade security | Solana security |
| **Smart Contracts** | Clarity (decidable) | Rust/Anchor |
| **Costs** | Predictable fees | Variable gas |
| **Currency** | STX, sBTC (real BTC) | SOL, USDC |
| **Escrow** | On-chain Clarity escrow | Program-based |

## 🧪 Development

```bash
# Clone repository
git clone https://github.com/PugarHuda/stackpay-cli
cd stackpay-cli

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run CLI in development
cd packages/cli
node bin/run.js init test-project
```

## 📘 Documentation

- [Quick Start Guide](./docs/QUICKSTART.md)
- [API Reference](./docs/API-REFERENCE.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Smart Contract Guide](./docs/CONTRACTS.md)

## 🏆 Built With

- **[x402-stacks](https://docs.x402stacks.xyz/)** — Payment protocol
- **[Stacks.js](https://github.com/hirosystems/stacks.js)** — Blockchain interaction
- **[Clarity](https://book.clarity-lang.org/)** — Smart contract language
- **[oclif](https://oclif.io/)** — CLI framework
- **[React](https://react.dev/)** + **[Recharts](https://recharts.org/)** — Dashboard
- **[Express](https://expressjs.com/)** / **[Fastify](https://fastify.dev/)** — API templates

## 📄 License

MIT © StackPay Contributors

---

**Built for the [x402 Stacks Challenge](https://docs.x402stacks.xyz/) Hackathon** 🚀
