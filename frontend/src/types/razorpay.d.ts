interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayPaymentFailure {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
}

interface RazorpayCheckoutInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayPaymentFailure) => void): void;
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayCheckoutInstance;
}
