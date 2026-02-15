;; StackPay Escrow Contract
;; Manages payment locking and release for API micropayments
;; Built for the x402 Stacks Challenge Hackathon
;;
;; Flow:
;; 1. API consumer locks payment in escrow (lock-payment)
;; 2. After successful API response, payment is released to provider (release-payment)
;; 3. If API fails, payment is refunded to consumer (refund-payment)

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PAYMENT-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-RELEASED (err u102))
(define-constant ERR-ALREADY-REFUNDED (err u103))
(define-constant ERR-INVALID-AMOUNT (err u104))
(define-constant ERR-EXPIRED (err u105))
(define-constant ERR-ALREADY-EXISTS (err u106))

;; Payment expiry in blocks (~24 hours at 10 min/block)
(define-constant PAYMENT-EXPIRY u144)

;; Data variables
(define-data-var total-payments uint u0)
(define-data-var total-revenue uint u0)
(define-data-var total-refunds uint u0)

;; Data structures
(define-map escrow-payments
  { payment-id: (buff 32) }
  {
    payer: principal,
    recipient: principal,
    amount: uint,
    created-at: uint,
    released: bool,
    refunded: bool
  }
)

;; Track payments per address (for analytics)
(define-map address-stats
  { address: principal }
  {
    total-received: uint,
    total-sent: uint,
    payment-count: uint
  }
)

;; ==================
;; Public Functions
;; ==================

;; Lock payment in escrow
;; Called by API consumer before making API call
(define-public (lock-payment (payment-id (buff 32)) (recipient principal) (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    ;; Prevent duplicate payment IDs from overwriting existing payments
    (asserts! (is-none (map-get? escrow-payments { payment-id: payment-id })) ERR-ALREADY-EXISTS)

    ;; Transfer STX from sender to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

    ;; Record escrow payment
    (map-set escrow-payments
      { payment-id: payment-id }
      {
        payer: tx-sender,
        recipient: recipient,
        amount: amount,
        created-at: block-height,
        released: false,
        refunded: false
      }
    )

    ;; Update stats
    (var-set total-payments (+ (var-get total-payments) u1))

    ;; Update payer stats
    (match (map-get? address-stats { address: tx-sender })
      existing (map-set address-stats
        { address: tx-sender }
        (merge existing {
          total-sent: (+ (get total-sent existing) amount),
          payment-count: (+ (get payment-count existing) u1)
        })
      )
      (map-set address-stats
        { address: tx-sender }
        { total-received: u0, total-sent: amount, payment-count: u1 }
      )
    )

    (ok true)
  )
)

;; Release payment to API provider
;; Called by the recipient after successful API response
(define-public (release-payment (payment-id (buff 32)))
  (let (
    (payment (unwrap! (map-get? escrow-payments { payment-id: payment-id }) ERR-PAYMENT-NOT-FOUND))
  )
    ;; Only recipient can release
    (asserts! (is-eq tx-sender (get recipient payment)) ERR-NOT-AUTHORIZED)
    (asserts! (not (get released payment)) ERR-ALREADY-RELEASED)
    (asserts! (not (get refunded payment)) ERR-ALREADY-REFUNDED)

    ;; Transfer from contract to recipient
    (try! (as-contract (stx-transfer? (get amount payment) tx-sender (get recipient payment))))

    ;; Mark as released
    (map-set escrow-payments
      { payment-id: payment-id }
      (merge payment { released: true })
    )

    ;; Update revenue stats
    (var-set total-revenue (+ (var-get total-revenue) (get amount payment)))

    ;; Update recipient stats
    (match (map-get? address-stats { address: (get recipient payment) })
      existing (map-set address-stats
        { address: (get recipient payment) }
        (merge existing {
          total-received: (+ (get total-received existing) (get amount payment)),
          payment-count: (+ (get payment-count existing) u1)
        })
      )
      (map-set address-stats
        { address: (get recipient payment) }
        { total-received: (get amount payment), total-sent: u0, payment-count: u1 }
      )
    )

    (ok true)
  )
)

;; Refund payment to API consumer
;; Called if API fails or by either party before release
(define-public (refund-payment (payment-id (buff 32)))
  (let (
    (payment (unwrap! (map-get? escrow-payments { payment-id: payment-id }) ERR-PAYMENT-NOT-FOUND))
  )
    ;; Either payer or recipient can initiate refund
    (asserts! (or
      (is-eq tx-sender (get payer payment))
      (is-eq tx-sender (get recipient payment))
    ) ERR-NOT-AUTHORIZED)
    (asserts! (not (get released payment)) ERR-ALREADY-RELEASED)
    (asserts! (not (get refunded payment)) ERR-ALREADY-REFUNDED)

    ;; Transfer back to payer
    (try! (as-contract (stx-transfer? (get amount payment) tx-sender (get payer payment))))

    ;; Mark as refunded
    (map-set escrow-payments
      { payment-id: payment-id }
      (merge payment { refunded: true })
    )

    ;; Update refund stats
    (var-set total-refunds (+ (var-get total-refunds) u1))

    (ok true)
  )
)

;; Claim expired payment (refund after expiry)
;; Anyone can call this for expired unclaimed payments
(define-public (claim-expired (payment-id (buff 32)))
  (let (
    (payment (unwrap! (map-get? escrow-payments { payment-id: payment-id }) ERR-PAYMENT-NOT-FOUND))
  )
    (asserts! (not (get released payment)) ERR-ALREADY-RELEASED)
    (asserts! (not (get refunded payment)) ERR-ALREADY-REFUNDED)
    (asserts! (> block-height (+ (get created-at payment) PAYMENT-EXPIRY)) ERR-NOT-AUTHORIZED)

    ;; Refund to payer
    (try! (as-contract (stx-transfer? (get amount payment) tx-sender (get payer payment))))

    ;; Mark as refunded
    (map-set escrow-payments
      { payment-id: payment-id }
      (merge payment { refunded: true })
    )

    (var-set total-refunds (+ (var-get total-refunds) u1))

    (ok true)
  )
)

;; ==================
;; Read-only Functions
;; ==================

;; Get payment details
(define-read-only (get-payment (payment-id (buff 32)))
  (map-get? escrow-payments { payment-id: payment-id })
)

;; Get address statistics
(define-read-only (get-address-stats (address principal))
  (default-to
    { total-received: u0, total-sent: u0, payment-count: u0 }
    (map-get? address-stats { address: address })
  )
)

;; Get contract statistics
(define-read-only (get-contract-stats)
  {
    total-payments: (var-get total-payments),
    total-revenue: (var-get total-revenue),
    total-refunds: (var-get total-refunds),
    contract-balance: (stx-get-balance (as-contract tx-sender))
  }
)

;; Check if payment exists and is pending
(define-read-only (is-payment-pending (payment-id (buff 32)))
  (match (map-get? escrow-payments { payment-id: payment-id })
    payment (and
      (not (get released payment))
      (not (get refunded payment))
    )
    false
  )
)

;; Check if payment is expired
(define-read-only (is-payment-expired (payment-id (buff 32)))
  (match (map-get? escrow-payments { payment-id: payment-id })
    payment (> block-height (+ (get created-at payment) PAYMENT-EXPIRY))
    false
  )
)
