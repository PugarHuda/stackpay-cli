/**
 * x402 Payment Required Middleware for StackPay
 * Verifies Bitcoin micropayments on Stacks blockchain before serving API responses
 */

const STACKS_API = {
  testnet: "https://api.testnet.hiro.so",
  mainnet: "https://api.mainnet.hiro.so",
};

// Track used transaction IDs to prevent replay attacks
const usedTxIds = new Set();

async function verifyPayment(txId, config) {
  try {
    // Prevent replay attacks
    if (usedTxIds.has(txId)) {
      return { valid: false, reason: "Transaction already used as payment" };
    }

    // Validate txId format
    if (!/^0x[0-9a-fA-F]{64}$/.test(txId)) {
      return { valid: false, reason: "Invalid transaction ID format" };
    }

    const apiUrl = STACKS_API[config.network] || STACKS_API.testnet;
    const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);

    if (!response.ok) {
      return { valid: false, reason: "Transaction not found" };
    }

    const tx = await response.json();
    const microAmount = Math.round(config.price * 1000000);

    if (tx.tx_status !== "success") {
      return { valid: false, reason: `Transaction status: ${tx.tx_status}` };
    }
    if (tx.tx_type !== "token_transfer") {
      return { valid: false, reason: "Not a token transfer" };
    }
    if (tx.token_transfer.recipient_address !== config.paymentAddress) {
      return { valid: false, reason: "Wrong recipient address" };
    }
    if (Number(tx.token_transfer.amount) < microAmount) {
      return { valid: false, reason: "Insufficient amount" };
    }

    // Mark transaction as used
    usedTxIds.add(txId);

    return { valid: true, tx };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
}

function x402Handler(config) {
  return async (req, res, next) => {
    // Validate paymentAddress is configured
    if (!config.paymentAddress) {
      return res.status(500).json({
        error: "Server Configuration Error",
        message: "Payment address not configured. Run: stackpay config --address <YOUR_STX_ADDRESS>",
      });
    }

    const paymentProof = req.headers["x-payment-proof"];

    if (!paymentProof) {
      return res.status(402).json({
        status: 402,
        error: "Payment Required",
        payment: {
          protocol: "x402-stacks",
          network: config.network,
          recipient: config.paymentAddress,
          amount: config.price,
          currency: config.currency,
          instructions: `Send ${config.price} ${config.currency} to ${config.paymentAddress}`,
        },
        headers: {
          "X-Payment-Proof":
            "Include the Stacks transaction ID as payment proof",
        },
      });
    }

    try {
      const result = await verifyPayment(paymentProof, config);
      if (!result.valid) {
        return res.status(402).json({
          status: 402,
          error: "Invalid Payment",
          message: result.reason,
          txId: paymentProof,
        });
      }

      req.payment = { txId: paymentProof, verified: true };
      next();
    } catch (error) {
      return res.status(500).json({
        error: "Payment Verification Error",
        message: error.message,
      });
    }
  };
}

module.exports = { x402Handler, verifyPayment };
