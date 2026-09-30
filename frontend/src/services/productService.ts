import type { Product } from "../types/product";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/products";

export async function getProducts(filters?: { category?: string | number; categoryId?: number; subcategory?: string; gender?: string; brand?: string; minPrice?: number; maxPrice?: number; rating?: number; available?: boolean; attributeKey?: string; attributeValue?: string }): Promise<Product[]> {
  const query = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, String(value)); });
  const response = await fetch(query.size ? `${API_URL}?${query}` : API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export async function createProduct(dto: Omit<Product, "id">): Promise<Product> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create product.");
  }

  return response.json();
}

export async function updateProduct(id: number, dto: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update product.");
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product.");
  }
}
