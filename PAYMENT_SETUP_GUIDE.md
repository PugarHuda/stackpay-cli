# 💰 StackPay Payment Setup & Testing Guide

## 🎯 Overview

Panduan lengkap untuk setup payment address dan testing payment flow dengan x402-stacks protocol.

---

## 📝 Step 1: Setup Payment Address

### Option A: Menggunakan CLI Config Command

```bash
# Masuk ke project directory
cd my-api

# Set payment address (WAJIB!)
stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Set pricing (optional, default 0.01 STX)
stackpay config --price 0.01 --currency STX

# Set network (optional, default testnet)
stackpay config --network testnet

# Lihat konfigurasi saat ini
stackpay config --show
```

### Option B: Edit Manual stackpay.config.json

```json
{
  "projectName": "my-api",
  "price": 0.01,
  "currency": "STX",
  "paymentAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "network": "testnet",
  "escrowContract": "",
  "createdAt": "2026-02-16T00:00:00.000Z"
}
```

**PENTING**: `paymentAddress` HARUS diisi dengan Stacks address Anda!

---

## 🔑 Cara Mendapatkan Stacks Address

### Option 1: Hiro Wallet (Recommended)

1. Install Hiro Wallet: https://wallet.hiro.so/
2. Create new wallet atau import existing
3. Copy address Anda (format: `SP...` untuk testnet)
4. Untuk testnet faucet: https://explorer.stacks.co/sandbox/faucet

### Option 2: Leather Wallet

1. Install Leather: https://leather.io/
2. Create wallet
3. Switch ke Testnet
4. Copy address

### Option 3: Generate via CLI (Advanced)

```bash
npm install -g @stacks/cli
stacks make_keychain -t
```

---

## 🧪 Step 2: Testing Payment Flow

### A. Start Your API

```bash
# Start API server
npm start

# API akan running di http://localhost:3000
```

### B. Test Free Endpoint (No Payment)

```bash
# Test endpoint yang tidak memerlukan payment
curl http://localhost:3000/

# Response:
{
  "name": "my-api",
  "status": "running",
  "pricing": "0.01 STX per API call",
  "docs": "/docs"
}
```

### C. Test Paid Endpoint (Returns HTTP 402)

```bash
# Request tanpa payment proof
curl -i http://localhost:3000/api/data

# Response: HTTP 402 Payment Required
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "protocol": "x402-stacks",
    "network": "testnet",
    "recipient": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "amount": 0.01,
    "currency": "STX",
    "instructions": "Send 0.01 STX to SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
  },
  "headers": {
    "X-Payment-Proof": "Include the Stacks transaction ID as payment proof"
  }
}
```

---

## 💸 Step 3: Make Payment on Stacks

### Using Hiro Wallet

1. Open Hiro Wallet
2. Click "Send"
3. Paste recipient address: `SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7`
4. Amount: `0.01` STX
5. Click "Send"
6. **COPY TRANSACTION ID** (format: `0x1234...`)

### Using Stacks CLI

```bash
stacks send_tokens \
  SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 \
  10000 \
  0 \
  <YOUR_PRIVATE_KEY> \
  -t
```

### Transaction ID Format

Transaction ID harus format: `0x` + 64 hex characters

Example: `0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890`

---

## ✅ Step 4: Verify Payment & Get API Response

### Request dengan Payment Proof

```bash
# Include transaction ID di header X-Payment-Proof
curl -H "X-Payment-Proof: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890" \
  http://localhost:3000/api/data

# Response: API data (jika payment valid)
{
  "message": "Hello from my-api!",
  "data": {
    "example": "This is a paid API response",
    "timestamp": "2026-02-16T10:30:00.000Z"
  },
  "meta": {
    "price": 0.01,
    "currency": "STX"
  }
}
```

### Jika Payment Invalid

```bash
# Response: HTTP 402 dengan error message
{
  "status": 402,
  "error": "Invalid Payment",
  "message": "Transaction not found",
  "txId": "0x1234..."
}
```

---

## 🔍 Step 5: Check Transaction di Explorer

### Stacks Explorer

1. Buka: https://explorer.stacks.co/
2. Switch ke **Testnet** (kanan atas)
3. Paste transaction ID di search bar
4. Lihat detail transaction:
   - Status: Success/Pending/Failed
   - Amount: 0.01 STX (10000 micro-STX)
   - Recipient: Your payment address
   - Block height

### Direct Link Format

```
https://explorer.stacks.co/txid/0x1234...?chain=testnet
```

### Verify Transaction Details

Transaction harus memenuhi:
- ✅ Status: `success`
- ✅ Type: `token_transfer`
- ✅ Recipient: Match dengan `paymentAddress` di config
- ✅ Amount: >= `price` di config (dalam micro-STX)

---

## 🎯 Complete Example Flow

### 1. Setup Project

```bash
# Create new API
stackpay init weather-api
cd weather-api
npm install

# Configure payment
stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 --price 0.001

# Start server
npm start
```

### 2. Test Free Endpoint

```bash
curl http://localhost:3000/
# ✅ Works without payment
```

### 3. Test Paid Endpoint (No Payment)

```bash
curl http://localhost:3000/api/data
# ❌ Returns HTTP 402 Payment Required
```

### 4. Send Payment

```bash
# Using Hiro Wallet:
# - Send 0.001 STX to SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
# - Copy TX ID: 0xabc123...
```

### 5. Wait for Confirmation

```bash
# Check di explorer (biasanya 10-30 detik)
https://explorer.stacks.co/txid/0xabc123...?chain=testnet
```

### 6. Request dengan Payment Proof

```bash
curl -H "X-Payment-Proof: 0xabc123..." http://localhost:3000/api/data
# ✅ Returns API data
```

---

## 🐛 Troubleshooting

### Error: "Payment address not configured"

**Solution:**
```bash
stackpay config --address <YOUR_STX_ADDRESS>
```

### Error: "Transaction not found"

**Causes:**
- Transaction belum confirmed (tunggu 10-30 detik)
- Transaction ID salah format
- Network mismatch (testnet vs mainnet)

**Solution:**
- Check transaction di explorer
- Pastikan format: `0x` + 64 hex chars
- Pastikan network match (testnet/mainnet)

### Error: "Wrong recipient address"

**Cause:** Payment dikirim ke address yang salah

**Solution:**
- Check `paymentAddress` di config
- Kirim payment ke address yang benar

### Error: "Insufficient amount"

**Cause:** Payment amount < price di config

**Solution:**
- Check `price` di config (dalam STX)
- Kirim amount yang cukup (minimal = price)

### Error: "Transaction already used as payment"

**Cause:** Transaction ID sudah pernah digunakan (replay attack prevention)

**Solution:**
- Kirim payment baru
- Gunakan transaction ID yang baru

---

## 📊 Testing dengan Example APIs

### Weather API (0.001 STX)

```bash
cd examples/weather-api
npm install
npm start

# Test
curl http://localhost:3001/api/weather?city=tokyo
# Returns HTTP 402

# Send 0.001 STX, get TX ID, then:
curl -H "X-Payment-Proof: 0x..." http://localhost:3001/api/weather?city=tokyo
```

### Stock API (0.005 STX)

```bash
cd examples/stock-api
npm install
npm start

# Test
curl http://localhost:3002/api/stock/AAPL
# Returns HTTP 402

# Send 0.005 STX, get TX ID, then:
curl -H "X-Payment-Proof: 0x..." http://localhost:3002/api/stock/AAPL
```

### AI Text API (0.01 STX)

```bash
cd examples/ai-text-api
npm install
npm start

# Test
curl -X POST http://localhost:3003/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Your text here"}'
# Returns HTTP 402

# Send 0.01 STX, get TX ID, then:
curl -X POST http://localhost:3003/api/summarize \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: 0x..." \
  -d '{"text":"Your text here"}'
```

---

## 🎥 Video Demo Script

### Part 1: Setup (30 seconds)
```bash
stackpay init demo-api
cd demo-api
npm install
stackpay config --address SP2J6ZY... --price 0.01
npm start
```

### Part 2: Test Payment Flow (1 minute)
1. Show HTTP 402 response
2. Open Hiro Wallet
3. Send payment
4. Copy TX ID
5. Request with payment proof
6. Show successful response

### Part 3: Explorer (30 seconds)
1. Open Stacks Explorer
2. Paste TX ID
3. Show transaction details
4. Verify payment

---

## 📚 Additional Resources

- **x402-stacks Docs**: https://docs.x402stacks.xyz/
- **Stacks Explorer**: https://explorer.stacks.co/
- **Hiro Wallet**: https://wallet.hiro.so/
- **Stacks Faucet**: https://explorer.stacks.co/sandbox/faucet
- **Stacks Docs**: https://docs.stacks.co

---

## 💡 Tips

1. **Use Testnet First**: Always test di testnet sebelum mainnet
2. **Get Test STX**: Use faucet untuk dapat test STX gratis
3. **Save TX IDs**: Simpan transaction IDs untuk testing
4. **Check Explorer**: Selalu verify di explorer sebelum request
5. **Wait for Confirmation**: Tunggu ~10-30 detik untuk confirmation

---

**Happy Testing! 🚀**
