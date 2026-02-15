# StackPay Architecture

## Overview

StackPay is a monorepo consisting of three main packages plus supporting infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│                      Developer (User)                        │
│                                                              │
│  $ stackpay init my-api                                     │
│  $ stackpay config --price 0.01 --currency STX              │
│  $ stackpay dev                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────▼──────────┐
              │   CLI Package     │
              │   (oclif-based)   │
              │                   │
              │  Commands:        │
              │  - init           │
              │  - config         │
              │  - dev            │
              │  - deploy         │
              │  - status         │
              └────────┬──────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
   ┌──────▼──────┐  ┌─▼──────┐  ┌─▼──────────┐
   │  Templates  │  │  SDK   │  │ Dashboard   │
   │  (Express/  │  │        │  │ (React +    │
   │   Fastify)  │  │Payment │  │  Recharts)  │
   │             │  │Handler │  │             │
   └─────────────┘  │Middleware│  └─────────────┘
                     └────┬────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
      ┌───────▼───┐  ┌───▼────┐  ┌──▼──────────┐
      │  Stacks   │  │ x402   │  │   Clarity   │
      │  Node API │  │Protocol│  │  Contracts  │
      └───────────┘  └────────┘  └─────────────┘
              │                         │
              └─────────┬───────────────┘
                        │
              ┌─────────▼──────────┐
              │  Stacks Blockchain │
              │   (Bitcoin L2)     │
              └────────────────────┘
```

## Component Details

### 1. CLI Package (`packages/cli`)

**Purpose:** Developer interface for creating and managing monetized APIs.

**Technology:** [oclif](https://oclif.io/) CLI framework, TypeScript

**Commands:**

| Command  | Description           | Key Logic                      |
| -------- | --------------------- | ------------------------------ |
| `init`   | Scaffold new project  | Handlebars template generation |
| `config` | Manage settings       | JSON config file manipulation  |
| `dev`    | Start dev server      | Node.js child process spawning |
| `deploy` | Deploy smart contract | Stacks.js contract deployment  |
| `status` | Show metrics          | Stacks API querying            |

### 2. SDK Package (`packages/sdk`)

**Purpose:** Core payment verification and middleware logic.

**Key Classes:**

- **`PaymentHandler`** — Verifies payments on Stacks blockchain
  - `verifyPayment()` — Checks transaction status, amount, recipient
  - `generatePaymentRequest()` — Creates HTTP 402 response body
  - `waitForPayment()` — Polls for incoming payments
  - `getBalance()` — Fetches STX balance

- **`x402Handler` middleware** — Express/Fastify compatible middleware
  - Checks `X-Payment-Proof` header
  - Returns 402 if missing/invalid
  - Passes through on valid payment

### 3. Dashboard (`packages/dashboard`)

**Purpose:** Visual revenue monitoring and configuration.

**Technology:** React 18, Vite, Tailwind CSS, Recharts, Lucide icons

**Views:**

- Overview — Metrics cards + revenue/calls charts
- Transactions — Detailed payment history table
- Settings — Configuration management

### 4. Smart Contracts (`contracts/`)

**Purpose:** On-chain escrow and revenue management.

**Technology:** Clarity (Stacks smart contract language)

**Contract Functions:**

| Function             | Type      | Description               |
| -------------------- | --------- | ------------------------- |
| `lock-payment`       | Public    | Lock STX in escrow        |
| `release-payment`    | Public    | Release to API provider   |
| `refund-payment`     | Public    | Return to consumer        |
| `claim-expired`      | Public    | Auto-refund after timeout |
| `get-payment`        | Read-only | Query payment details     |
| `get-contract-stats` | Read-only | Total revenue/payments    |

## Data Flow

### Payment Verification Flow

```
1. Client → GET /api/data
2. Middleware checks X-Payment-Proof header
3. If missing → 402 Payment Required response
4. If present → Query Stacks API for transaction
5. Verify: status=success, type=token_transfer,
   recipient=config.address, amount>=config.price
6. If valid → next() → API response
7. If invalid → 402 Invalid Payment
```

### Smart Contract Escrow Flow

```
1. Consumer calls lock-payment (STX → contract)
2. Consumer makes API call with payment-id
3. On success → Provider calls release-payment (contract → provider)
4. On failure → Either party calls refund-payment (contract → consumer)
5. On timeout → Anyone calls claim-expired (contract → consumer)
```

## Security Considerations

- **Payment proofs are transaction IDs** verified on-chain
- **Clarity contracts are decidable** — no infinite loops or reentrancy
- **Private keys never leave the client** — only public addresses in config
- **HTTPS recommended** for production API deployment
- **Rate limiting** should be added for production use
