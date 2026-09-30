import type { Order } from "../types/order";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/order";

function normalizeOrder(order: Order): Order {
  return {
    ...order,
    items: (order.items ?? []).map((item) => ({ ...item, totalPrice: item.subtotal ?? 0 })),
  };
}

export async function createOrder(shippingAddressId: number, paymentMethod: string): Promise<Order> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ addressId: shippingAddressId, paymentMethod }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to place order.");
  }

  return normalizeOrder(await response.json());
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve order history.");
  }

  return (await response.json()).map(normalizeOrder);
}

export async function getOrderById(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve order details.");
  }

  return normalizeOrder(await response.json());
}

export async function getAllOrdersAdmin(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/admin`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve admin orders.");
  }

  return (await response.json()).map(normalizeOrder);
}

export async function updateOrderStatusAdmin(id: number, status: string): Promise<Order> {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update order status.");
  }

  return normalizeOrder(await response.json());
}
