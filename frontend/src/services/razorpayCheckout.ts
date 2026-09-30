const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  const loadingScript = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("Razorpay Checkout did not load."));
    script.onerror = () => reject(new Error("Razorpay Checkout did not load."));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    scriptPromise = null;
    throw error;
  });

  scriptPromise = loadingScript;
  return loadingScript;
}
