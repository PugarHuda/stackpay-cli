# StackPay Smart Contracts

## Escrow Contract (`contracts/escrow.clar`)

The StackPay escrow contract provides secure payment handling for API micropayments on Stacks.

### Overview

The contract manages the lifecycle of API payments:

1. **Lock** — Consumer locks STX before making an API call
2. **Release** — Provider claims payment after successful API response
3. **Refund** — Payment returned to consumer if API fails
4. **Expire** — Auto-refund after timeout (144 blocks ≈ 24 hours)

### Deployment

```bash
# Set your Stacks private key
export STACKS_PRIVATE_KEY=your_private_key_here

# Deploy to testnet
stackpay deploy --network testnet

# Deploy to mainnet
stackpay deploy --network mainnet
```

### Contract Functions

#### Public Functions

##### `lock-payment`

```clarity
(define-public (lock-payment
  (payment-id (buff 32))
  (recipient principal)
  (amount uint))
```

Locks STX in escrow for a specific API call.

- `payment-id`: Unique identifier (32-byte buffer)
- `recipient`: API provider's Stacks address
- `amount`: Payment in micro-STX (0.01 STX = 10000)

##### `release-payment`

```clarity
(define-public (release-payment (payment-id (buff 32)))
```

Releases payment to the API provider. Only callable by the recipient.

##### `refund-payment`

```clarity
(define-public (refund-payment (payment-id (buff 32)))
```

Refunds payment to the consumer. Callable by payer or recipient.

##### `claim-expired`

```clarity
(define-public (claim-expired (payment-id (buff 32)))
```

Refunds expired payments. Callable by anyone after 144 blocks.

#### Read-Only Functions

##### `get-payment`

```clarity
(define-read-only (get-payment (payment-id (buff 32)))
```

Returns payment details: payer, recipient, amount, timestamps, status.

##### `get-address-stats`

```clarity
(define-read-only (get-address-stats (address principal))
```

Returns per-address statistics: total received, sent, payment count.

##### `get-contract-stats`

```clarity
(define-read-only (get-contract-stats)
```

Returns global statistics: total payments, revenue, refunds, balance.

### Error Codes

| Code | Name                  | Description                           |
| ---- | --------------------- | ------------------------------------- |
| u100 | ERR-NOT-AUTHORIZED    | Caller not authorized for this action |
| u101 | ERR-PAYMENT-NOT-FOUND | Payment ID doesn't exist              |
| u102 | ERR-ALREADY-RELEASED  | Payment already released              |
| u103 | ERR-ALREADY-REFUNDED  | Payment already refunded              |
| u104 | ERR-INVALID-AMOUNT    | Zero or negative amount               |
| u105 | ERR-EXPIRED           | Payment has expired                   |

### Testing

Test the contract using Clarinet:

```bash
# Install Clarinet
# See: https://docs.hiro.so/clarinet/installation

# Run tests
clarinet test

# Interactive REPL
clarinet console
```

Example test session:

```clarity
;; In Clarinet console
(contract-call? .escrow lock-payment
  0x0102030405060708091011121314151617181920212223242526272829303132
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
  u10000)
;; >> (ok true)

(contract-call? .escrow get-payment
  0x0102030405060708091011121314151617181920212223242526272829303132)
;; >> (some { amount: u10000, ... })
```
