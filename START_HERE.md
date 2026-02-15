# 🚀 START HERE - Quick Testing Guide

## ✅ Your Testnet Wallet (READY!)
```
ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT
```

**All configs updated!** ✅

---

## 🎯 Quick Test (5 Minutes)

### Step 1: Get Test STX (FREE!)

1. **Open Faucet**: https://explorer.stacks.co/sandbox/faucet
2. **Paste your address**: `ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT`
3. **Click "Request STX"**
4. **Wait ~30 seconds**
5. **Check balance**: https://explorer.stacks.co/address/ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT?chain=testnet

You should get ~500 STX testnet (free!)

---

### Step 2: Start Weather API

```bash
cd examples/weather-api
npm install
npm start
```

API running at: http://localhost:3001

---

### Step 3: Test HTTP 402 (Payment Required)

```bash
curl http://localhost:3001/api/weather?city=tokyo
```

**Response:**
```json
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "recipient": "ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT",
    "amount": 0.001,
    "currency": "STX"
  }
}
```

✅ Perfect! API meminta payment.

---

### Step 4: Send Payment (Via Hiro Wallet)

1. **Open Hiro Wallet**: https://wallet.hiro.so/
2. **Make sure you're on Testnet** (check top right)
3. **Click "Send"**
4. **To**: `ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT` (ke diri sendiri!)
5. **Amount**: `0.001` STX
6. **Click "Confirm"**
7. **COPY Transaction ID** (format: `0x1234567890abcdef...`)

---

### Step 5: Wait for Confirmation

```bash
# Check transaction di explorer
https://explorer.stacks.co/txid/0xYOUR_TX_ID?chain=testnet
```

Wait until **Status = Success** (~10-30 seconds)

---

### Step 6: Request dengan Payment Proof

```bash
curl -H "X-Payment-Proof: 0xYOUR_TX_ID" \
  http://localhost:3001/api/weather?city=tokyo
```

**Response (SUCCESS!):**
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

🎉 **Payment verified! API returned data!**

---

## 📊 Check Your Revenue

### Via Hiro Wallet
- Open wallet
- Check balance (should be same, karena kirim ke diri sendiri)
- View transaction history

### Via Explorer
https://explorer.stacks.co/address/ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT?chain=testnet

See:
- Balance
- Transaction history
- Received payments

---

## 🎨 View Dashboard

```bash
cd packages/dashboard
npm install
npm run dev
```

Visit: http://localhost:5173

**Neo Brutalism Dashboard** with:
- 💰 Revenue metrics (bold colors!)
- 📊 API call charts
- 🔥 Transaction history
- ⚙️ Settings

---

## 🎥 Ready for Demo Video!

### Script (3 minutes):

**Part 1: Show API (30 sec)**
```bash
cd examples/weather-api
npm start
curl http://localhost:3001/api/weather?city=tokyo
# Show HTTP 402 response
```

**Part 2: Send Payment (30 sec)**
- Open Hiro Wallet
- Send 0.001 STX
- Copy TX ID
- Show transaction in explorer

**Part 3: Successful Request (30 sec)**
```bash
curl -H "X-Payment-Proof: 0x..." http://localhost:3001/api/weather?city=tokyo
# Show weather data returned
```

**Part 4: Dashboard (30 sec)**
```bash
cd packages/dashboard
npm run dev
# Show neo brutalism dashboard
```

**Part 5: Explain (60 sec)**
- x402-stacks protocol
- Bitcoin settlement via Stacks
- On-chain payment verification
- 60-second setup for any API

---

## ✅ Testing Checklist

- [x] Testnet address configured: `ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT`
- [ ] Got test STX from faucet
- [ ] Weather API running
- [ ] HTTP 402 response works
- [ ] Sent payment via Hiro Wallet
- [ ] Transaction confirmed in explorer
- [ ] Request with TX ID returns data
- [ ] Dashboard shows metrics
- [ ] Ready for demo video!

---

## 🔗 Quick Links

- **Your Address**: https://explorer.stacks.co/address/ST1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE27JV8YT?chain=testnet
- **Faucet**: https://explorer.stacks.co/sandbox/faucet
- **Hiro Wallet**: https://wallet.hiro.so/
- **GitHub**: https://github.com/PugarHuda/stackpay-cli

---

## 💡 Pro Tips

1. **Test dengan Weather API dulu** (paling murah: 0.001 STX)
2. **Kirim ke diri sendiri** untuk testing (dapat STX kembali)
3. **Save TX IDs** untuk reuse di demo
4. **Check explorer** sebelum request
5. **Wait 10-30 seconds** untuk confirmation

---

## 🎯 Next Steps

1. ✅ Get test STX from faucet
2. ✅ Test payment flow
3. ✅ Record demo video
4. ✅ Submit to DoraHacks: https://dorahacks.io/hackathon/x402-stacks/buidl

**You're ready to go! 🚀**
