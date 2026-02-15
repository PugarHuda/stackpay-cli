# StackPay CLI - x402 Stacks Challenge Submission

## 🎯 Project Overview

**StackPay CLI** adalah developer tool yang memungkinkan monetisasi API dengan Bitcoin micropayments dalam waktu kurang dari 60 detik. Dibangun menggunakan protokol [x402-stacks](https://docs.x402stacks.xyz/) dan Stacks blockchain.

## ✅ Kesesuaian dengan Challenge Requirements

### 1. x402-stacks Protocol Integration ✅
- Implementasi lengkap HTTP 402 Payment Required
- Payment verification on-chain via Stacks API
- Support untuk STX, sBTC, dan USDCx
- Replay attack prevention dengan transaction tracking

### 2. Stacks Blockchain Integration ✅
- Payment settlement di Stacks Layer 2 (Bitcoin-backed)
- Smart contract Clarity untuk escrow
- Testnet dan Mainnet support
- On-chain payment verification

### 3. Working MVP ✅
- CLI tool yang fully functional
- 3 working example APIs (Weather, Stock, AI Text)
- Real-time dashboard dengan neo brutalism design
- Template generator untuk Express & Fastify

### 4. Developer-Friendly ✅
- 60-second setup dari zero ke monetized API
- Beautiful CLI dengan oclif framework
- Comprehensive documentation
- Easy configuration management

## 🚀 Key Features

### CLI Commands
```bash
stackpay init <name>        # Create new monetized API project
stackpay config             # Configure pricing & payment address
stackpay dev                # Start development server
stackpay deploy             # Deploy smart contract to Stacks
stackpay status             # Check revenue metrics
```

### Dashboard (Neo Brutalism Design)
- 💰 Real-time revenue tracking
- 📊 API call metrics & charts
- 🔥 Transaction history dengan status
- ⚙️ Configuration management
- Bold colors: Yellow, Cyan, Pink, Green, Purple
- Thick borders (4px) & shadow-brutal effects
- Space Grotesk font untuk modern look

### Payment Flow
1. Client request → HTTP 402 Payment Required
2. Client sends STX payment on Stacks
3. Client includes TX ID in `X-Payment-Proof` header
4. Server verifies payment on-chain
5. Server returns API response

### Smart Contract (Clarity)
```clarity
;; Escrow functions
(lock-payment payment-id recipient amount)
(release-payment payment-id)
(refund-payment payment-id)
```

## 📦 Project Structure

```
stackpay-cli/
├── packages/
│   ├── cli/              # StackPay CLI (oclif)
│   │   ├── commands/     # init, config, dev, deploy, status
│   │   └── templates/    # Express & Fastify templates
│   ├── sdk/              # Payment verification SDK
│   └── dashboard/        # React dashboard (Neo Brutalism)
├── contracts/            # Clarity smart contracts
│   └── escrow.clar       # Payment escrow
└── examples/             # Working example APIs
    ├── weather-api/      # Weather data (0.001 STX)
    ├── stock-api/        # Stock & crypto prices (0.005 STX)
    └── ai-text-api/      # AI text analysis (0.01 STX)
```

## 🎨 Neo Brutalism Dashboard

Dashboard menggunakan design system neo brutalism dengan karakteristik:
- **Bold Colors**: Yellow (#FFE500), Cyan (#00F0FF), Pink (#FF6B9D), Green (#00FF94), Purple (#B794F6)
- **Thick Borders**: 4px solid black borders
- **Brutal Shadows**: 4px/8px/12px offset shadows
- **Space Grotesk Font**: Modern geometric sans-serif
- **Hover Effects**: Translate + shadow removal
- **No Rounded Corners**: Sharp, geometric shapes

## 🔧 Technical Stack

- **CLI**: oclif, TypeScript, Handlebars
- **SDK**: Stacks.js, Payment verification
- **Dashboard**: React, Vite, TailwindCSS, Recharts
- **Smart Contracts**: Clarity
- **API Templates**: Express, Fastify
- **Blockchain**: Stacks (Bitcoin Layer 2)

## 📊 Example APIs (All Working!)

### 1. Weather API (Port 3001)
```bash
GET /api/weather?city=tokyo
Price: 0.001 STX per call
```

### 2. Stock & Crypto API (Port 3002)
```bash
GET /api/stock/AAPL
GET /api/crypto
Price: 0.005 STX per call
```

### 3. AI Text API (Port 3003)
```bash
POST /api/summarize
POST /api/sentiment
POST /api/keywords
Price: 0.01 STX per call
```

## 🎯 Innovation Points

1. **60-Second Setup**: Fastest way to monetize APIs with Bitcoin
2. **Developer Experience**: Beautiful CLI + comprehensive templates
3. **Neo Brutalism Dashboard**: Modern, bold design yang eye-catching
4. **Smart Contract Escrow**: Secure payment handling
5. **Multiple Frameworks**: Support Express & Fastify
6. **Real Examples**: 3 working APIs demonstrating different use cases

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/PugarHuda/stackpay-cli
cd stackpay-cli

# Install dependencies
pnpm install

# Build packages
pnpm build

# Try example API
cd examples/weather-api
npm install
npm start

# Visit http://localhost:3001
```

## 📹 Demo Video

[Link to demo video showing:]
- CLI init creating new project
- Configuration setup
- API running with payment flow
- Dashboard showing metrics
- Payment verification on Stacks

## 🔗 Links

- **GitHub**: https://github.com/PugarHuda/stackpay-cli
- **Documentation**: See `/docs` folder
- **x402-stacks**: https://docs.x402stacks.xyz/
- **Stacks**: https://docs.stacks.co

## 💡 Use Cases

1. **AI API Monetization**: Charge per inference/generation
2. **Data APIs**: Weather, stock, crypto prices
3. **Content APIs**: Paywalls for premium content
4. **Microservices**: Pay-per-use internal services
5. **Agent-to-Agent Payments**: AI agents paying for API access

## 🏆 Why StackPay Wins

- ✅ **Complete Solution**: CLI + SDK + Dashboard + Smart Contracts
- ✅ **Production Ready**: Working examples, comprehensive docs
- ✅ **Beautiful Design**: Neo brutalism dashboard yang memorable
- ✅ **Developer First**: 60-second setup, great DX
- ✅ **Bitcoin Security**: Settled on Bitcoin via Stacks L2
- ✅ **Open Source**: MIT license, community-driven

## 📄 License

MIT © StackPay Contributors

---

**Built for x402 Stacks Challenge 2026** 🚀
Submission Date: February 15, 2026
