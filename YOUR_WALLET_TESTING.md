# 🎯 Testing Guide - Your Wallet

## 💳 Your Stacks Testnet Wallet
```
ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT
```

**Network**: Testnet ✅  
**Explorer**: https://explorer.stacks.co/address/ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT?chain=testnet

---

## ✅ All Example APIs Sudah Dikonfigurasi!

Semua example APIs sudah menggunakan wallet address Anda:

### 1. Weather API (0.001 STX)
```bash
cd examples/weather-api
npm install
npm start
# Port: 3001
# Payment to: ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT
```

### 2. Stock API (0.005 STX)
```bash
cd examples/stock-api
npm install
npm start
# Port: 3002
# Payment to: ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT
```

### 3. AI Text API (0.01 STX)
```bash
cd examples/ai-text-api
npm install
npm start
# Port: 3003
# Payment to: ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT
```

---

## 🧪 Quick Test Flow

### Step 1: Start Weather API (Paling Murah - 0.001 STX)

```bash
cd examples/weather-api
npm install
npm start
```

### Step 2: Test Endpoint (Returns HTTP 402)

```bash
curl http://localhost:3001/api/weather?city=tokyo
```

**Response:**
```json
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "protocol": "x402-stacks",
    "network": "testnet",
    "recipient": "ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT",
    "amount": 0.001,
    "currency": "STX"
  }
}
```

### Step 3: Get Test STX (Jika Belum Punya)

1. Buka: https://explorer.stacks.co/sandbox/faucet
2. Paste address: `ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT`
3. Request STX (dapat ~500 STX testnet)

### Step 4: Send Payment ke Diri Sendiri (Testing)

**Menggunakan Hiro Wallet:**
1. Open: https://wallet.hiro.so/
2. Login dengan wallet Anda
3. Click "Send"
4. **To**: `ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT` (ke diri sendiri!)
5. **Amount**: `0.001` STX
6. Click "Send"
7. **COPY Transaction ID** (format: `0x1234...`)

### Step 5: Wait for Confirmation

```bash
# Check di explorer (10-30 detik)
https://explorer.stacks.co/txid/0xYOUR_TX_ID?chain=testnet
```

Tunggu sampai status = **Success**

### Step 6: Request dengan Payment Proof

```bash
curl -H "X-Payment-Proof: 0xYOUR_TX_ID" \
  http://localhost:3001/api/weather?city=tokyo
```

**Response (Success!):**
```json
{
  "city": "Tokyo",
  "temperature": 15.2,
  "condition": "Partly Cloudy",
  "humidity": 65,
  "wind_speed": 12.5,
  "timestamp": "2026-02-16T10:30:00Z"
}
```

---

## 💰 Check Your Revenue

Setelah payment berhasil, check balance Anda:

### Via Hiro Wallet
- Open wallet
- Balance akan bertambah (karena kirim ke diri sendiri)

### Via Explorer
```
https://explorer.stacks.co/address/SP1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE3S27JEV?chain=testnet
```

Lihat:
- Balance
- Transaction history
- Received payments

---

## 🎥 Demo Video Script

### Part 1: Setup (30 seconds)
```bash
cd examples/weather-api
npm start
# Show API running
```

### Part 2: Test HTTP 402 (15 seconds)
```bash
curl http://localhost:3001/api/weather?city=tokyo
# Show 402 response dengan payment instructions
```

### Part 3: Send Payment (30 seconds)
1. Open Hiro Wallet
2. Send 0.001 STX ke SP1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE3S27JEV
3. Copy TX ID
4. Show transaction di explorer

### Part 4: Successful Request (30 seconds)
```bash
curl -H "X-Payment-Proof: 0x..." http://localhost:3001/api/weather?city=tokyo
# Show successful API response
```

### Part 5: Dashboard (30 seconds)
```bash
cd packages/dashboard
npm run dev
# Show neo brutalism dashboard dengan metrics
```

---

## 🔍 Verify Everything Works

### Checklist:
- [ ] Weather API running di port 3001
- [ ] Config shows: `SP1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE3S27JEV`
- [ ] Request tanpa payment returns HTTP 402
- [ ] Payment instructions show correct address
- [ ] Sent 0.001 STX payment
- [ ] Transaction confirmed di explorer
- [ ] Request dengan TX ID returns weather data
- [ ] Balance updated di wallet

---

## 📊 Test All 3 APIs

### Weather API (0.001 STX)
```bash
# Start
cd examples/weather-api && npm start

# Test
curl http://localhost:3001/api/weather?city=london

# Pay 0.001 STX, get TX ID, then:
curl -H "X-Payment-Proof: 0x..." http://localhost:3001/api/weather?city=london
```

### Stock API (0.005 STX)
```bash
# Start
cd examples/stock-api && npm start

# Test
curl http://localhost:3002/api/stock/BTC

# Pay 0.005 STX, get TX ID, then:
curl -H "X-Payment-Proof: 0x..." http://localhost:3002/api/stock/BTC
```

### AI Text API (0.01 STX)
```bash
# Start
cd examples/ai-text-api && npm start

# Test
curl -X POST http://localhost:3003/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Your text here"}'

# Pay 0.01 STX, get TX ID, then:
curl -X POST http://localhost:3003/api/summarize \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: 0x..." \
  -d '{"text":"Your text here"}'
```

---

## 💡 Pro Tips

1. **Test dengan Weather API dulu** (paling murah: 0.001 STX)
2. **Kirim ke diri sendiri** untuk testing (dapat STX kembali)
3. **Save TX IDs** untuk reuse di demo video
4. **Check explorer** sebelum request dengan TX ID
5. **Wait 10-30 seconds** untuk confirmation

---

## 🎯 Ready for Demo!

Semua sudah siap:
- ✅ Wallet configured: `SP1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE3S27JEV`
- ✅ 3 example APIs ready
- ✅ Payment flow tested
- ✅ Dashboard ready
- ✅ Documentation complete

**Next**: Buat demo video dan submit ke DoraHacks! 🚀

---

## 🔗 Quick Links

- **Your Address**: https://explorer.stacks.co/address/ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT?chain=testnet
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet
- **Hiro Wallet**: https://wallet.hiro.so/
- **Explorer**: https://explorer.stacks.co/

Good luck! 🎉
