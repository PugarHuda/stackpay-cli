export interface PaymentConfig {
  network: "mainnet" | "testnet";
  recipientAddress: string;
  amount: number;
  currency: "STX" | "sBTC" | "USDCx";
}

export interface PaymentVerification {
  txId: string;
  expectedAmount: number;
  expectedCurrency: string;
  recipientAddress: string;
  network?: "mainnet" | "testnet";
}

export interface TransactionInfo {
  tx_id: string;
  tx_status: string;
  tx_type: string;
  token_transfer?: {
    recipient_address: string;
    amount: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Track used transaction IDs to prevent replay attacks
const usedTxIds = new Set<string>();

export class PaymentHandler {
  private networkType: "mainnet" | "testnet";

  constructor(networkType: "mainnet" | "testnet" = "testnet") {
    this.networkType = networkType;
  }

  /**
   * Get the Stacks API URL for the configured network
   */
  getApiUrl(): string {
    return this.networkType === "mainnet"
      ? "https://api.mainnet.hiro.so"
      : "https://api.testnet.hiro.so";
  }

  /**
   * Verify a payment transaction on Stacks blockchain
   */
  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    try {
      // Prevent replay attacks: reject already-used transaction IDs
      if (usedTxIds.has(verification.txId)) {
        console.error("Payment rejected: transaction already used:", verification.txId);
        return false;
      }

      // Validate txId format (0x + 64 hex chars)
      if (!/^0x[0-9a-fA-F]{64}$/.test(verification.txId)) {
        console.error("Payment rejected: invalid transaction ID format");
        return false;
      }

      const apiUrl = this.getApiUrl();
      const response = await fetch(
        `${apiUrl}/extended/v1/tx/${verification.txId}`,
      );

      if (!response.ok) {
        throw new Error(`Transaction not found: ${verification.txId}`);
      }

      const tx: TransactionInfo = await response.json();

      // Verify transaction details
      const checks = [
        tx.tx_status === "success",
        tx.tx_type === "token_transfer",
        tx.token_transfer?.recipient_address === verification.recipientAddress,
        Number(tx.token_transfer?.amount || 0) >=
          verification.expectedAmount * 1_000_000, // Convert STX to micro-STX
      ];

      const isValid = checks.every((check) => check === true);

      // Mark transaction as used only if valid
      if (isValid) {
        usedTxIds.add(verification.txId);
      }

      return isValid;
    } catch (error) {
      console.error("Payment verification failed:", error);
      return false;
    }
  }

  /**
   * Generate payment request for HTTP 402 response
   */
  generatePaymentRequest(config: PaymentConfig): object {
    const microAmount = Math.round(config.amount * 1_000_000); // STX to micro-STX
    return {
      status: 402,
      error: "Payment Required",
      payment: {
        network: config.network,
        recipient: config.recipientAddress,
        amount: config.amount,
        amountMicro: microAmount,
        currency: config.currency,
        instructions: `Send ${config.amount} ${config.currency} to ${config.recipientAddress}`,
      },
      headers: {
        "WWW-Authenticate": `x402-stacks amount=${config.amount} currency=${config.currency} address=${config.recipientAddress} network=${config.network}`,
      },
    };
  }

  /**
   * Fetch transaction details from Stacks blockchain
   */
  async getTransaction(txId: string): Promise<TransactionInfo | null> {
    try {
      const apiUrl = this.getApiUrl();
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Monitor pending payment with polling
   */
  async waitForPayment(
    recipientAddress: string,
    expectedAmount: number,
    timeout: number = 300000, // 5 minutes
  ): Promise<string | null> {
    const startTime = Date.now();
    const microAmount = expectedAmount * 1_000_000;

    while (Date.now() - startTime < timeout) {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/extended/v1/address/${recipientAddress}/transactions?limit=10`,
        );

        if (response.ok) {
          const data = await response.json();
          const recentTx = data.results?.find(
            (tx: TransactionInfo) =>
              tx.tx_type === "token_transfer" &&
              Number(tx.token_transfer?.amount || 0) >= microAmount &&
              tx.tx_status === "success",
          );

          if (recentTx) {
            return recentTx.tx_id;
          }
        }
      } catch {
        // Ignore errors, continue polling
      }

      // Wait 5 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    return null;
  }

  /**
   * Get recent transactions for an address
   */
  async getRecentTransactions(
    address: string,
    limit: number = 20,
  ): Promise<TransactionInfo[]> {
    try {
      const apiUrl = this.getApiUrl();
      const response = await fetch(
        `${apiUrl}/extended/v1/address/${address}/transactions?limit=${limit}`,
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.results || [];
    } catch {
      return [];
    }
  }

  /**
   * Get STX balance for an address
   */
  async getBalance(address: string): Promise<{ stx: number; locked: number }> {
    try {
      const apiUrl = this.getApiUrl();
      const response = await fetch(
        `${apiUrl}/extended/v1/address/${address}/balances`,
      );

      if (!response.ok) {
        return { stx: 0, locked: 0 };
      }

      const data = await response.json();
      return {
        stx: Number(data.stx?.balance || 0) / 1_000_000,
        locked: Number(data.stx?.locked || 0) / 1_000_000,
      };
    } catch {
      return { stx: 0, locked: 0 };
    }
  }
}

/**
 * Clear a used transaction ID (for testing purposes)
 */
export function clearUsedTxId(txId: string): void {
  usedTxIds.delete(txId);
}

export async function verifyPayment(
  verification: PaymentVerification,
): Promise<boolean> {
  const handler = new PaymentHandler(verification.network);
  return handler.verifyPayment(verification);
}

/**
 * Convenience function to generate a payment request
 */
export function generatePaymentRequest(config: PaymentConfig): object {
  const handler = new PaymentHandler(config.network);
  return handler.generatePaymentRequest(config);
}
