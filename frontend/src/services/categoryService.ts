import type { Category } from "../types/category";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/categories";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function createCategory(dto: { name: string; description?: string; parentCategoryId?: number | null }): Promise<Category> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create category.");
  }

  return response.json();
}

export async function updateCategory(id: number, dto: { name: string; description?: string; parentCategoryId?: number | null }): Promise<Category> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update category.");
  }

  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete category.");
  }
}
