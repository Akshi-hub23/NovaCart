import type { Review, ProductRating } from "../types/review";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/review";

export async function getProductReviews(productId: number): Promise<Review[]> {
  const response = await fetch(`${API_URL}/product/${productId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to load product reviews.");
  }

  return await response.json();
}

export async function getProductRating(productId: number): Promise<ProductRating> {
  const response = await fetch(`${API_URL}/product/${productId}/rating`);

  if (!response.ok) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return await response.json();
}

export async function createReview(productId: number, rating: number, comment: string): Promise<Review> {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating, comment }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit review.");
  }

  return await response.json();
}

export async function updateReview(reviewId: number, rating: number, comment: string): Promise<Review> {
  const response = await fetch(`${API_URL}/${reviewId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating, comment }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update review.");
  }

  return await response.json();
}

export async function deleteReview(reviewId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete review.");
  }
}
