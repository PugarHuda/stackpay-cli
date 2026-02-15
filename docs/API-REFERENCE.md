# StackPay API Reference

## SDK API

### `PaymentHandler`

```typescript
import { PaymentHandler } from "@stackpay/sdk";

const handler = new PaymentHandler("testnet");
```

#### `verifyPayment(verification)`

Verifies a payment transaction on the Stacks blockchain.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `txId` | `string` | Transaction ID to verify |
| `expectedAmount` | `number` | Expected payment amount in STX |
| `expectedCurrency` | `string` | Expected currency (`STX`, `sBTC`, `USDCx`) |
| `recipientAddress` | `string` | Expected recipient address |
| `network?` | `'mainnet' \| 'testnet'` | Network (default: testnet) |

**Returns:** `Promise<boolean>`

```typescript
const isValid = await handler.verifyPayment({
  txId: "0x1234...",
  expectedAmount: 0.01,
  expectedCurrency: "STX",
  recipientAddress: "SP2J6ZY...",
});
```

#### `generatePaymentRequest(config)`

Generates a payment request object for HTTP 402 responses.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `network` | `'mainnet' \| 'testnet'` | Stacks network |
| `recipientAddress` | `string` | Payment recipient |
| `amount` | `number` | Price in STX |
| `currency` | `'STX' \| 'sBTC' \| 'USDCx'` | Payment currency |

**Returns:** `object` with status, error, payment details, and headers

#### `waitForPayment(recipientAddress, expectedAmount, timeout?)`

Polls the blockchain for incoming payments.

**Returns:** `Promise<string | null>` — Transaction ID or null if timeout

#### `getBalance(address)`

Gets STX balance for an address.

**Returns:** `Promise<{ stx: number, locked: number }>`

#### `getRecentTransactions(address, limit?)`

Gets recent transactions for an address.

**Returns:** `Promise<TransactionInfo[]>`

---

### `x402Handler` Middleware

```typescript
import { x402Handler } from "@stackpay/sdk";

app.use("/api", x402Handler(config));
```

**Config:**

```typescript
interface StackPayConfig {
  projectName: string;
  price: number;
  currency: "STX" | "sBTC" | "USDCx";
  paymentAddress: string;
  network: "mainnet" | "testnet";
  excludePaths?: string[];
}
```

The middleware:

1. Skips paths in `excludePaths`, `/health`, and `/`
2. Checks for `X-Payment-Proof` header
3. Returns 402 if missing
4. Verifies payment on-chain if present
5. Calls `next()` on valid payment

---

## HTTP Headers

### Request Headers

| Header            | Description           | Example         |
| ----------------- | --------------------- | --------------- |
| `X-Payment-Proof` | Stacks transaction ID | `0x1a2b3c4d...` |

### Response Headers (402)

| Header             | Description                    |
| ------------------ | ------------------------------ |
| `WWW-Authenticate` | x402-stacks payment parameters |

---

## Configuration File

`stackpay.config.json`:

```json
{
  "projectName": "my-api",
  "price": 0.01,
  "currency": "STX",
  "paymentAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "network": "testnet",
  "escrowContract": "",
  "createdAt": "2026-02-09T00:00:00.000Z"
}
```

| Field            | Type     | Description                        |
| ---------------- | -------- | ---------------------------------- |
| `projectName`    | `string` | API project name                   |
| `price`          | `number` | Price per API call in STX          |
| `currency`       | `string` | `STX`, `sBTC`, or `USDCx`          |
| `paymentAddress` | `string` | Stacks address to receive payments |
| `network`        | `string` | `testnet` or `mainnet`             |
| `escrowContract` | `string` | Deployed escrow contract TX ID     |

---

## Smart Contract API

### `lock-payment`

```clarity
(define-public (lock-payment
  (payment-id (buff 32))
  (recipient principal)
  (amount uint))
```

Lock STX in escrow. Amount is in micro-STX.

### `release-payment`

```clarity
(define-public (release-payment (payment-id (buff 32)))
```

Release escrowed payment to recipient. Must be called by recipient.

### `refund-payment`

```clarity
(define-public (refund-payment (payment-id (buff 32)))
```

Refund payment to payer. Can be called by payer or recipient.

### `get-payment`

```clarity
(define-read-only (get-payment (payment-id (buff 32)))
```

Returns payment details or `none`.

### `get-contract-stats`

```clarity
(define-read-only (get-contract-stats)
```

Returns `{ total-payments, total-revenue, total-refunds, contract-balance }`.
