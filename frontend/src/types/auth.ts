// Matches UserResponseDto: { id, name, email, role, createdAt }
export interface User {
  id: number;
  name?: string;       // backend: "name" (not "fullName")
  email: string;
  role: string;
  createdAt?: string;
}

// Internal DTOs — used only for API calls, not stored
export interface LoginDto {
  email: string;
  password: string;    // backend: "password" (not "passwordHash")
}

export interface RegisterDto {
  email: string;
  password: string;    // backend: "password" (not "passwordHash")
  name?: string;       // backend: "name" (not "fullName")
}

// Matches LoginResponseDto: { token, user }
export interface AuthResponse {
  token: string;
  user: User;
}
