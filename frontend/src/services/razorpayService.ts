import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/payments/create-order";

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export async function createRazorpayOrder(): Promise<RazorpayOrder> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unable to start payment.");
  }

  const data: unknown = await response.json();
  if (!isRazorpayOrder(data)) {
    throw new Error("Unable to start payment.");
  }

  return data;
}

function isRazorpayOrder(value: unknown): value is RazorpayOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Record<string, unknown>;
  return typeof order.orderId === "string"
    && typeof order.amount === "number"
    && typeof order.currency === "string"
    && typeof order.keyId === "string";
}
