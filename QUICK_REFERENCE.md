# ⚡ StackPay Quick Reference

## 🚀 Setup (60 seconds)

```bash
# 1. Create project
stackpay init my-api
cd my-api
npm install

# 2. Set payment address (REQUIRED!)
stackpay config --address SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# 3. Start server
npm start
```

---

## 💰 Payment Flow

### 1. Request tanpa payment → HTTP 402
```bash
curl http://localhost:3000/api/data

# Response:
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "amount": 0.01,
    "currency": "STX",
    "recipient": "SP2J6ZY..."
  }
}
```

### 2. Kirim payment di Stacks
- Open Hiro Wallet: https://wallet.hiro.so/
- Send 0.01 STX ke address di response
- Copy Transaction ID (format: `0x1234...`)

### 3. Request dengan payment proof → Success
```bash
curl -H "X-Payment-Proof: 0x1234..." http://localhost:3000/api/data

# Response: API data
{
  "message": "Hello!",
  "data": {...}
}
```

---

## 🔧 CLI Commands

```bash
# Create project
stackpay init <name> [--template express|fastify]

# Configure
stackpay config --address <STX_ADDRESS>
stackpay config --price 0.01 --currency STX
stackpay config --network testnet
stackpay config --show

# Development
stackpay dev

# Deploy contract
stackpay deploy --contract-name escrow

# Check status
stackpay status
```

---

## 🔗 Important Links

### Get Stacks Address
- **Hiro Wallet**: https://wallet.hiro.so/
- **Testnet Faucet**: https://explorer.stacks.co/sandbox/faucet

### Check Transactions
- **Explorer**: https://explorer.stacks.co/
- **Format**: `https://explorer.stacks.co/txid/0x...?chain=testnet`

### Documentation
- **Payment Guide**: [PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md)
- **x402-stacks**: https://docs.x402stacks.xyz/
- **Stacks Docs**: https://docs.stacks.co

---

## 📊 Example APIs

### Weather API (0.001 STX)
```bash
cd examples/weather-api
npm install && npm start
# Port: 3001
```

### Stock API (0.005 STX)
```bash
cd examples/stock-api
npm install && npm start
# Port: 3002
```

### AI Text API (0.01 STX)
```bash
cd examples/ai-text-api
npm install && npm start
# Port: 3003
```

---

## 🐛 Common Issues

### "Payment address not configured"
```bash
stackpay config --address SP2J6ZY...
```

### "Transaction not found"
- Wait 10-30 seconds for confirmation
- Check transaction di explorer
- Verify TX ID format: `0x` + 64 hex chars

### "Wrong recipient address"
- Check `paymentAddress` di `stackpay.config.json`
- Kirim payment ke address yang benar

### "Insufficient amount"
- Check `price` di config
- Kirim amount >= price

---

## 📝 Config File Format

```json
{
  "projectName": "my-api",
  "price": 0.01,
  "currency": "STX",
  "paymentAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "network": "testnet"
}
```

---

## 🎯 Testing Checklist

- [ ] Payment address configured
- [ ] Server running
- [ ] Free endpoint works (GET /)
- [ ] Paid endpoint returns 402 (GET /api/data)
- [ ] Payment sent on Stacks
- [ ] Transaction confirmed (check explorer)
- [ ] Request with TX ID works
- [ ] API returns data

---

## 💡 Pro Tips

1. **Always use testnet first** before mainnet
2. **Get test STX** from faucet (free!)
3. **Save TX IDs** for testing
4. **Check explorer** before requesting
5. **Wait for confirmation** (~10-30 seconds)

---

**Need help?** See [PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md) for detailed instructions.
