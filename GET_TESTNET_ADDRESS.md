# 🔑 Get Your Testnet Address

## ⚠️ Current Issue

Your address: `SP1B3V8D8FP56G1GB4F4GX11KZBJGH2FNE3S27JEV`
- This is a **MAINNET** address (starts with `SP`)
- Faucet error: `BadAddressVersionByte`
- Faucet only works with **TESTNET** addresses (starts with `ST`)

---

## ✅ Solution: Get Testnet Address

### Option 1: Hiro Wallet (Easiest)

1. **Open Hiro Wallet**: https://wallet.hiro.so/
2. **Switch to Testnet**:
   - Click Settings (gear icon)
   - Network → Select "Testnet"
3. **Copy Testnet Address**:
   - Should start with `ST...`
   - Example: `ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7`

### Option 2: Leather Wallet

1. **Install Leather**: https://leather.io/
2. **Create/Import Wallet**
3. **Switch to Testnet**:
   - Settings → Network → Testnet
4. **Copy Address** (starts with `ST...`)

### Option 3: Generate via CLI

```bash
# Install Stacks CLI
npm install -g @stacks/cli

# Generate testnet keychain
stacks make_keychain -t

# Output will show:
# {
#   "mnemonic": "word1 word2 word3...",
#   "keyInfo": {
#     "address": "ST...",  ← Your testnet address
#     "privateKey": "..."
#   }
# }
```

---

## 🔄 Update Your Config

Once you have testnet address (starts with `ST...`):

### Update All Example APIs:

```bash
# Weather API
cd examples/weather-api
# Edit stackpay.config.json
# Change paymentAddress to: ST...

# Stock API
cd examples/stock-api
# Edit stackpay.config.json
# Change paymentAddress to: ST...

# AI Text API
cd examples/ai-text-api
# Edit stackpay.config.json
# Change paymentAddress to: ST...
```

### Or Use CLI:

```bash
cd examples/weather-api
stackpay config --address ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
```

---

## 💰 Get Test STX

After you have testnet address:

1. **Open Faucet**: https://explorer.stacks.co/sandbox/faucet
2. **Paste your ST... address**
3. **Request STX** (will get ~500 STX testnet)
4. **Check balance**: https://explorer.stacks.co/address/ST...?chain=testnet

---

## 🎯 Mainnet vs Testnet

| Feature | Testnet (ST...) | Mainnet (SP...) |
|---------|-----------------|-----------------|
| **Address Prefix** | ST | SP |
| **STX Cost** | Free (faucet) | Real money |
| **Purpose** | Testing | Production |
| **Faucet** | ✅ Available | ❌ Not available |
| **Explorer** | explorer.stacks.co?chain=testnet | explorer.stacks.co |
| **Recommended for Demo** | ✅ Yes | ❌ No |

---

## 📝 Example Testnet Addresses

Valid testnet addresses (for reference):
```
ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE
ST3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE
```

---

## 🚀 Quick Test After Getting Testnet Address

```bash
# 1. Update config
cd examples/weather-api
stackpay config --address ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# 2. Get test STX from faucet
# Visit: https://explorer.stacks.co/sandbox/faucet

# 3. Start API
npm start

# 4. Test payment flow
curl http://localhost:3001/api/weather?city=tokyo
# Returns HTTP 402 with payment instructions

# 5. Send payment to yourself (ST... address)
# Via Hiro Wallet: Send 0.001 STX to ST...

# 6. Request with TX ID
curl -H "X-Payment-Proof: 0x..." http://localhost:3001/api/weather?city=tokyo
# Returns weather data!
```

---

## 💡 Why This Happened

Your wallet might be:
1. **Hiro Wallet on Mainnet** - Switch to Testnet in settings
2. **Leather Wallet on Mainnet** - Switch to Testnet
3. **Generated for Mainnet** - Generate new one with `-t` flag

**Solution**: Always use testnet for development and demos!

---

## 🔗 Helpful Links

- **Hiro Wallet**: https://wallet.hiro.so/
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet
- **Testnet Explorer**: https://explorer.stacks.co/?chain=testnet
- **Stacks CLI**: https://github.com/hirosystems/stacks.js/tree/master/packages/cli

---

**Next Step**: Get your testnet address (ST...) and update configs! 🚀
