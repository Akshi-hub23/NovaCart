import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/wishlist";

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  imageUrl: string;
  isInStock: boolean;
  addedAt: string;
}

export interface WishlistResponse {
  id: number;
  userId: number;
  items: WishlistItem[];
}

export async function getWishlist(): Promise<WishlistResponse> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load wishlist.");
  }

  return response.json();
}

export async function addToWishlist(productId: number): Promise<WishlistResponse> {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to add to wishlist.");
  }

  return response.json();
}

export async function removeFromWishlist(productId: number): Promise<WishlistResponse> {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist.");
  }

  return response.json();
}

export async function moveToCart(productId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${productId}/move-to-cart`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to move to cart.");
  }
}
