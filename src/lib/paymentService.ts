/**
 * PAYMENT SERVICE ABSTRACTION
 * Prepares the frontend for embedded payment integration.
 * Currently mock-only — no real gateway is called.
 * To integrate: replace initiatePayment() with your payment provider SDK call.
 */

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface PaymentSession {
  orderId: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
}

/**
 * Initiates a payment session.
 * Real integration: call your payment gateway (Razorpay, Stripe, etc.) here.
 * NEXT_PUBLIC_PAYMENT_GATEWAY_KEY is available via process.env (see .env.example)
 */
export async function initiatePayment(
  amount: number,
  referenceId: string,
): Promise<PaymentSession> {
  await delay(800);

  // TODO: Replace with real payment gateway initialization:
  // const razorpay = new window.Razorpay({
  //   key: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_KEY,
  //   amount: amount * 100, // paise
  //   ...
  // });

  console.info("[PaymentService] Mock payment session created:", {
    referenceId,
    amount,
  });

  return {
    orderId: referenceId,
    amount,
    status: "pending",
  };
}

/**
 * Mock payment processing — simulates the 2-second embedded checkout flow.
 * Returns "success" or "failed" for UI branching.
 */
export async function processPayment(
  _session: PaymentSession,
): Promise<"success" | "failed"> {
  await delay(2000); // Simulate payment gateway processing
  // In production: this resolves via gateway webhook/callback, not polling
  return "success";
}

/**
 * Called after successful payment to record confirmation.
 */
export function handleSuccess(orderId: string): void {
  console.info("[PaymentService] Payment confirmed:", orderId);
  // TODO: Fire analytics event here (e.g., GTM dataLayer push)
}

/**
 * Called after payment failure — logs reason, ready for retry logic.
 */
export function handleFailure(reason: string): void {
  console.warn("[PaymentService] Payment failed:", reason);
  // TODO: Fire analytics/error tracking here
}
