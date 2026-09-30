import type { Cart } from "../types/cart";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/cart";

export async function getCart(): Promise<Cart> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve cart.");
  }

  return await response.json();
}

export async function addToCart(productId: number, quantity: number = 1): Promise<Cart> {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add item to cart.");
  }

  return await response.json();
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
  const response = await fetch(`${API_URL}/items/${cartItemId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update cart item.");
  }

  return await response.json();
}

export async function removeCartItem(cartItemId: number): Promise<Cart> {
  const response = await fetch(`${API_URL}/items/${cartItemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove item from cart.");
  }

  return await response.json();
}

export async function clearCart(): Promise<void> {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to clear cart.");
  }
}
