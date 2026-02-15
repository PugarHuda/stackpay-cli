import { PaymentHandler, PaymentConfig } from "./payment";

export interface StackPayConfig {
  projectName: string;
  price: number;
  currency: "STX" | "sBTC" | "USDCx";
  paymentAddress: string;
  network: "mainnet" | "testnet";
  escrowContract?: string;
  /** Paths to exclude from payment requirement */
  excludePaths?: string[];
  /** Custom payment verification timeout in ms */
  verificationTimeout?: number;
}

export interface StackPayRequest {
  headers: Record<string, string | string[] | undefined>;
  path?: string;
  url?: string;
}

export interface StackPayResponse {
  status: (code: number) => StackPayResponse;
  json: (body: object) => void;
  setHeader?: (name: string, value: string) => void;
}

export type NextFunction = () => void | Promise<void>;

/**
 * Creates x402 payment middleware for Express/Fastify
 * Returns HTTP 402 Payment Required if no valid payment proof is provided
 */
export function createPaymentMiddleware(config: StackPayConfig) {
  const paymentHandler = new PaymentHandler(config.network);

  return async (
    req: StackPayRequest,
    res: StackPayResponse,
    next: NextFunction,
  ): Promise<void> => {
    // Skip excluded paths
    const requestPath = req.path || req.url || "/";
    if (config.excludePaths?.some((p) => requestPath.startsWith(p))) {
      next();
      return;
    }

    // Skip health checks
    if (requestPath === "/health" || requestPath === "/") {
      next();
      return;
    }

    // Validate paymentAddress is configured
    if (!config.paymentAddress) {
      res.status(500).json({
        error: "Server configuration error",
        message: "Payment address not configured. Run: stackpay config --address <YOUR_STX_ADDRESS>",
      });
      return;
    }

    const paymentHeader = req.headers["x-payment-proof"] as string | undefined;

    if (!paymentHeader) {
      // Return 402 Payment Required with payment instructions
      const paymentRequest = paymentHandler.generatePaymentRequest({
        network: config.network,
        recipientAddress: config.paymentAddress,
        amount: config.price,
        currency: config.currency,
      });

      if (res.setHeader) {
        res.setHeader(
          "WWW-Authenticate",
          `x402-stacks amount=${config.price} currency=${config.currency} address=${config.paymentAddress} network=${config.network}`,
        );
      }

      res.status(402).json(paymentRequest);
      return;
    }

    try {
      // Verify payment on Stacks blockchain
      const isValid = await paymentHandler.verifyPayment({
        txId: paymentHeader,
        expectedAmount: config.price,
        expectedCurrency: config.currency,
        recipientAddress: config.paymentAddress,
        network: config.network,
      });

      if (!isValid) {
        res.status(402).json({
          error: "Invalid payment",
          message:
            "Payment verification failed. Transaction may be pending or invalid.",
          txId: paymentHeader,
        });
        return;
      }

      // Payment verified, proceed
      next();
    } catch (error) {
      res.status(500).json({
        error: "Payment verification error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };
}

/**
 * Express-compatible middleware wrapper
 */
export function x402Handler(config: StackPayConfig) {
  return createPaymentMiddleware(config);
}
