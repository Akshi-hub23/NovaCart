import type { User } from "../types/auth";

const API_URL = "http://localhost:5199/api/user";

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed. Please check credentials.");
  }

  const data = await response.json();
  // Backend returns { token: string, user: {...} }
  const token = data.token;
  if (token && typeof token === "string") {
    localStorage.setItem("token", token);
  }
  return data;
}

export async function registerUser(userData: { email: string; password: string; fullName?: string }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      name: userData.fullName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed.");
  }

  return await response.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    return null;
  }

  const data = await response.json();
  return {
    id: Number(data.id ?? data.userId),
    name: data.name,
    email: data.email,
    role: data.role || "User",
    createdAt: data.createdAt,
  };
}

export async function updateMyProfile(name: string): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update profile.");
  }
  return response.json();
}

export function logoutUser() {
  localStorage.removeItem("token");
}
