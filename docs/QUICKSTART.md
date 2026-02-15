# StackPay Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- A Stacks wallet (Hiro Wallet recommended)
- (Optional) STX tokens on testnet

## Step 1: Install StackPay CLI

```bash
npm install -g stackpay-cli
```

## Step 2: Create Your API

```bash
stackpay init my-weather-api
cd my-weather-api
npm install
```

This creates a project with:

- `index.js` — Express server with payment middleware
- `middleware/x402-handler.js` — x402 payment verification
- `stackpay.config.json` — Pricing configuration
- `package.json` — Dependencies

## Step 3: Configure Pricing

```bash
# Set your price and Stacks address
stackpay config --price 0.01 --currency STX --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Verify configuration
stackpay config --show
```

## Step 4: Add Your API Logic

Edit `index.js` and add your business logic to the API endpoint:

```javascript
app.get("/api/data", async (req, res) => {
  // Your API logic here
  const result = await fetchYourData();
  res.json(result);
});
```

## Step 5: Start Development Server

```bash
stackpay dev
```

Your API is now running at `http://localhost:3000`!

## Step 6: Test Payment Flow

```bash
# 1. Try without payment (gets 402)
curl http://localhost:3000/api/data

# 2. Send STX payment on testnet
# Use Hiro Wallet or Stacks CLI

# 3. Access with payment proof
curl -H "X-Payment-Proof: 0xYOUR_TX_ID" http://localhost:3000/api/data
```

## Next Steps

- [Deploy smart contract](./CONTRACTS.md) for escrow protection
- [Launch the dashboard](../packages/dashboard/) for revenue monitoring
- [Read the API reference](./API-REFERENCE.md) for advanced configuration
