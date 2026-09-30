import type { Address } from "../types/order";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5199/api/address";

export async function getUserAddresses(): Promise<Address[]> {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve addresses.");
  }

  return await response.json();
}

export async function createAddress(dto: Address): Promise<Address> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create address.");
  }

  return await response.json();
}
