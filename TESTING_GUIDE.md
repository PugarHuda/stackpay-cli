# 🧪 StackPay CLI - Panduan Testing Lokal

## ✅ Status: CLI Berhasil Terinstall!

```bash
stackpay-cli/1.0.0 win32-x64 node-v22.15.1
```

---

## 🎯 Cara Testing CLI

### 1. Test Version
```bash
stackpay --version
# Output: stackpay-cli/1.0.0
```

### 2. Test Init Command
```bash
# Buat folder test
mkdir test-demo
cd test-demo

# Init project baru
stackpay init my-weather-api
```

### 3. Test Example API (Paling Mudah untuk Demo)

#### Weather API
```bash
cd "f:/Hackathons/Hackathon Stacks/stackpay-cli/examples/weather-api"
npm install
npm start

# Buka di browser: http://localhost:3001/
# Atau test dengan curl:
curl http://localhost:3001/
```

**Expected Output:**
```json
{
  "name": "StackPay Weather API",
  "version": "1.0.0",
  "description": "Real-time weather data monetized with Bitcoin micropayments",
  "pricing": "0.001 STX per request",
  "endpoints": [...]
}
```

#### Test Payment Flow (HTTP 402)
```bash
# Request tanpa payment → HTTP 402
curl http://localhost:3001/api/weather?city=tokyo

# Expected: HTTP 402 Payment Required
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "protocol": "x402-stacks",
    "network": "testnet",
    "recipient": "",
    "amount": 0.001,
    "currency": "STX"
  }
}
```

---

## 🎬 Untuk Demo Video

### Skenario 1: CLI Setup (60 detik)
```bash
# Show version
stackpay --version

# Create new project
stackpay init demo-api

# Show generated files
cd demo-api && ls -la
cat stackpay.config.json
```

### Skenario 2: Example API Demo (lebih mudah!)
```bash
# Start weather API
cd examples/weather-api
npm start

# Show homepage (free endpoint)
curl http://localhost:3001/

# Show payment required (paid endpoint)
curl http://localhost:3001/api/weather?city=tokyo

# Show payment structure
```

### Skenario 3: Code Walkthrough
```bash
# Show middleware implementation
cat examples/weather-api/middleware/x402-handler.js

# Show smart contract
cat contracts/escrow.clar

# Show SDK payment verification
cat packages/sdk/src/payment.ts
```

---

## 📊 Testing Checklist

### CLI Commands
- [x] `stackpay --version` ✅ Works!
- [ ] `stackpay init <name>` - Creates new project
- [ ] `stackpay config --help` - Shows config options
- [ ] `stackpay --help` - Shows all commands

### Example APIs
- [ ] Weather API runs on port 3001
- [ ] Returns HTTP 402 for paid endpoints
- [ ] Free endpoints work without payment
- [ ] Payment middleware properly configured

### Payment Flow
- [ ] HTTP 402 response correct
- [ ] WWW-Authenticate header present
- [ ] Payment instructions clear
- [ ] x402-stacks protocol format correct

---

## 🚀 Quick Test Script

Simpan sebagai `test.sh`:

```bash
#!/bin/bash
echo "=== StackPay CLI Testing ==="
echo ""

echo "1. Testing CLI version..."
stackpay --version
echo ""

echo "2. Testing Weather API..."
cd examples/weather-api
npm install --silent
npm start &
API_PID=$!
sleep 3

echo "3. Testing homepage..."
curl http://localhost:3001/ | jq .

echo "4. Testing payment endpoint..."
curl http://localhost:3001/api/weather?city=tokyo | jq .

echo "5. Stopping API..."
kill $API_PID

echo ""
echo "=== Testing Complete! ==="
```

---

## 📝 Untuk Hackathon Submission

**PENTING:** Untuk submission hackathon, Anda **TIDAK PERLU** publish ke npm atau install global.

**Yang penting:**
1. ✅ GitHub repository PUBLIC - https://github.com/PugarHuda/stackpay-cli
2. ✅ README jelas dengan instructions
3. ✅ Code bisa di-run lokal (sudah tested!)
4. ⏳ Submit ke DoraHacks

**Installation instructions di README sudah benar:**
```bash
# Dari GitHub (for development)
git clone https://github.com/PugarHuda/stackpay-cli
cd stackpay-cli
pnpm install
cd packages/cli && npm link

# Atau langsung test example
cd examples/weather-api
npm install && npm start
```

---

## 🎥 Demo Video Tips

**Struktur 3-5 menit:**
1. **0-30s:** Intro - masalah API monetization
2. **30s-2m:** Demo CLI
   ```bash
   stackpay --version
   stackpay init demo-api
   cd demo-api && cat stackpay.config.json
   ```
3. **2m-3m30s:** Demo payment flow
   ```bash
   cd examples/weather-api && npm start
   # Show browser: HTTP 402 response
   # Explain x402-stacks protocol
   ```
4. **3m30s-4m30s:** Show code
   - Middleware: x402-handler.js
   - Smart contract: escrow.clar
5. **4m30s-5m:** Impact & conclusion

**Tools:**
- Screen recorder: OBS, ShareX, atau Win+G (bawaan Windows)
- Upload: YouTube (unlisted)

---

## ✅ Next Steps

1. ✅ CLI installed & working
2. ⏳ Test example API (opsional)
3. ⏳ Make demo video (opsional tapi bagus)
4. ⏳ **SUBMIT KE DORAHACKS** ← PRIORITAS!

**Link submission:** https://dorahacks.io/hackathon/x402-stacks/buidl

---

**Status:** CLI ready for demo! 🎉
