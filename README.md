# StackPay CLI ⚡

> **Monetize your APIs in 60 seconds with Bitcoin settlement on Stacks**

[![Built for x402](https://img.shields.io/badge/Built%20for-x402%20Stacks%20Challenge-blue)](https://docs.x402stacks.xyz/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![GitHub](https://img.shields.io/badge/GitHub-PugarHuda%2Fstackpay--cli-black?logo=github)](https://github.com/PugarHuda/stackpay-cli)

![StackPay Dashboard](https://img.shields.io/badge/Dashboard-Neo%20Brutalism-FFE500?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-00FF94?style=for-the-badge)

## 🎯 What is StackPay?

StackPay is a developer CLI tool that lets you monetize **any API** with Bitcoin micropayments in under 60 seconds. Built on the [Stacks](https://stacks.co) blockchain and the [x402 payment protocol](https://docs.x402stacks.xyz/), it provides:

- ⚡️ **60-second setup** — From zero to monetized API
- 🔒 **Bitcoin security** — Settled on Bitcoin via Stacks Layer 2
- 💰 **Micropayments** — Pay-per-call pricing (as low as 0.001 STX)
- 📊 **Neo Brutalism Dashboard** — Bold, modern design for revenue monitoring
- 🔧 **Developer-first** — Beautiful CLI with Express & Fastify templates
- 🏦 **Smart contract escrow** — Clarity-based escrow for secure payments
- 🎨 **Production Ready** — 3 working example APIs included

## 🚀 Quick Start

### Option 1: Create Your Own API (Recommended)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Create a new monetized API
cd packages/cli
node bin/run.js init my-api

# Configure your payment address
cd my-api
npm install
node ../bin/run.js config --address <YOUR_STX_ADDRESS> --price 0.01

# Start your API
npm start
```

### Option 2: Try the Example APIs

```bash
# Clone the repository
git clone https://github.com/PugarHuda/stackpay-cli
cd stackpay-cli

# Install dependencies
pnpm install

# Run the Weather API example
cd examples/weather-api
npm install
npm start

# Visit http://localhost:3001/
# Try the free endpoint: GET /
# Try the paid endpoint: GET /api/weather?city=tokyo
```

### Option 3: View the Dashboard

```bash
# Start the Neo Brutalism dashboard
cd packages/dashboard
npm install
npm run dev

# Visit http://localhost:5173
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
# Set payment address (REQUIRED!)
stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Set pricing
stackpay config --price 0.01 --currency STX

# Set network
stackpay config --network testnet

# View current configuration
stackpay config --show
```

**Important**: You MUST set your payment address before your API can accept payments!

Get a Stacks address:
- **Hiro Wallet**: https://wallet.hiro.so/
- **Leather Wallet**: https://leather.io/
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet

See [Payment Setup Guide](./PAYMENT_SETUP_GUIDE.md) for detailed instructions.

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

## 📊 Dashboard (Neo Brutalism Design)

The StackPay Dashboard features a bold **Neo Brutalism** design with real-time revenue monitoring:

### Design Features
- 🎨 **Bold Colors**: Yellow (#FFE500), Cyan (#00F0FF), Pink (#FF6B9D), Green (#00FF94), Purple (#B794F6)
- 🔲 **Thick Borders**: 4px solid black borders everywhere
- 💥 **Brutal Shadows**: 4px/8px/12px offset shadows for depth
- 🔤 **Space Grotesk Font**: Modern geometric sans-serif
- ✨ **Hover Effects**: Elements translate and lose shadow on hover
- 📐 **Sharp Corners**: No rounded corners, pure geometric shapes

### Dashboard Features
- 💰 **Revenue Charts** — Track income over time with bold visualizations
- 📊 **API Call Metrics** — Monitor usage patterns with colorful cards
- 🔥 **Transaction History** — View all payment verifications with status badges
- ⚙️ **Configuration Panel** — Manage pricing and addresses

```bash
# Start the dashboard
cd packages/dashboard
npm install
npm run dev

# Visit http://localhost:5173
```

![Dashboard Preview](https://via.placeholder.com/800x400/FFE500/000000?text=Neo+Brutalism+Dashboard)

## 📂 Example APIs (Ready to Run!)

All example APIs are **fully functional** and demonstrate the x402-stacks payment protocol in action.

### 🌤️ Weather API
Real-time weather data from Open-Meteo, monetized at 0.001 STX per call.

```bash
cd examples/weather-api
npm install
npm start

# Test endpoints:
# GET http://localhost:3001/ → API info (free)
# GET http://localhost:3001/api/weather?city=tokyo → Current weather (paid, returns HTTP 402)
# GET http://localhost:3001/api/forecast?city=london&days=7 → 7-day forecast (paid)
```

**Supported cities:** New York, London, Tokyo, Paris, Berlin, Sydney, Singapore, San Francisco, Jakarta, Mumbai

### 📈 Stock & Crypto API
Live stock quotes and cryptocurrency prices at 0.005 STX per call.

```bash
cd examples/stock-api
npm install
npm start

# GET http://localhost:3002/api/stock/AAPL → Apple stock quote
# GET http://localhost:3002/api/crypto → All crypto prices
```

### 🤖 AI Text API
Text analysis (summarization, sentiment, keywords, translation) at 0.01 STX per call.

```bash
cd examples/ai-text-api
npm install
npm start

# POST http://localhost:3003/api/summarize → Summarize text
# POST http://localhost:3003/api/sentiment → Analyze sentiment
# POST http://localhost:3003/api/keywords → Extract keywords
```

**Payment Flow Demo:**
1. Request without payment → HTTP 402 with payment instructions
2. Include `X-Payment-Proof` header with Stacks transaction ID
3. Server verifies payment on-chain → Returns API response

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

# Test CLI init command
cd packages/cli
node bin/run.js init test-project

# Test dashboard
cd ../dashboard
npm run dev

# Run example APIs
cd ../../examples/weather-api
npm install
npm start
```

## 🎥 Demo & Screenshots

### CLI in Action
```bash
$ stackpay init my-api
✓ Project created successfully!

$ cd my-api && npm install
$ stackpay config --address SP2J6ZY... --price 0.01
✓ Configuration updated!

$ npm start
⚡ my-api running on http://localhost:3000
💰 Accepting STX payments at 0.01 per call
```

### Dashboard Screenshots
- **Overview**: Colorful metrics cards with revenue & API calls
- **Charts**: Bold line & area charts with thick borders
- **Transactions**: Clean table with status badges (✓ Verified, ⏳ Pending, ✗ Failed)
- **Settings**: Configuration panel with brutal design

## 🏆 Why Choose StackPay?

### vs Traditional Payment Processors
- ❌ No credit card fees (2-3%)
- ❌ No monthly subscriptions
- ❌ No account management
- ✅ Direct Bitcoin settlement
- ✅ Micropayments support
- ✅ Instant verification

### vs Other Crypto Solutions
- ✅ **Bitcoin Security**: Settled on Bitcoin L1 via Stacks L2
- ✅ **Developer Experience**: 60-second setup, beautiful CLI
- ✅ **Smart Contracts**: Clarity language (decidable, secure)
- ✅ **Production Ready**: Working examples, comprehensive docs
- ✅ **Modern Design**: Neo brutalism dashboard

## 🎯 Use Cases

1. **AI API Monetization**: Charge per inference/generation
2. **Data APIs**: Weather, stock, crypto prices
3. **Content APIs**: Paywalls for premium content
4. **Microservices**: Pay-per-use internal services
5. **Agent-to-Agent Payments**: AI agents paying for API access
6. **IoT Payments**: Device-to-device micropayments
7. **Gaming APIs**: In-game item purchases
8. **Analytics APIs**: Pay-per-query data analytics

## 📘 Documentation

- [Payment Setup & Testing Guide](./PAYMENT_SETUP_GUIDE.md) — **START HERE!**
- [Quick Start Guide](./docs/QUICKSTART.md)
- [API Reference](./docs/API-REFERENCE.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Smart Contract Guide](./docs/CONTRACTS.md)
- [Submission Info](./SUBMISSION.md)

## 🏆 Built With

- **[x402-stacks](https://docs.x402stacks.xyz/)** — Payment protocol
- **[Stacks.js](https://github.com/hirosystems/stacks.js)** — Blockchain interaction
- **[Clarity](https://book.clarity-lang.org/)** — Smart contract language
- **[oclif](https://oclif.io/)** — CLI framework
- **[React](https://react.dev/)** + **[Recharts](https://recharts.org/)** — Dashboard
- **[Express](https://expressjs.com/)** / **[Fastify](https://fastify.dev/)** — API templates

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📞 Support

- **Documentation**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/PugarHuda/stackpay-cli/issues)
- **x402-stacks**: [docs.x402stacks.xyz](https://docs.x402stacks.xyz/)
- **Stacks**: [docs.stacks.co](https://docs.stacks.co)

## 🙏 Acknowledgments

- **Stacks Labs** — For the amazing Stacks blockchain
- **x402 Stacks Team** — For the payment protocol
- **DoraHacks** — For hosting the hackathon
- **Open Source Community** — For the tools and libraries

## 📄 License

MIT © StackPay Contributors

---

**Built for the [x402 Stacks Challenge](https://dorahacks.io/) Hackathon 2026** 🚀

**Submission Date**: February 16, 2026  
**Team**: StackPay Contributors  
**Status**: ✅ Production Ready
