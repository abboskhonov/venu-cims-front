import { api } from "@/lib/instance";
import qs from "qs";

// ----------------------
// Types
// ----------------------
export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  code: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  user: User;
  email: string;
  token?: string;
}

// ----------------------
// API Functions
// ----------------------

// Register a new user
export async function register(
  data: RegisterData,
): Promise<{ email: string; user?: User }> {
  try {
    console.log("Sending request to /auth/register with:", data);
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err: err) {
    console.error("Full error:", err);
    console.error("Response:", err.response?.data);
    throw new Error(err.response?.data?.message || "Registration failed");
  }
}

// Verify OTP
export async function verifyOTP(data: VerifyOTPData): Promise<AuthResponse> {
  try {
    console.log("Sending request to /auth/verify-otp with email:", data.email);
    const res = await api.post("/auth/verify-email", data);
    return res.data;
  } catch (err: any) {
    console.error("OTP verification error:", err.response?.data);
    throw new Error(err.response?.data?.message || "OTP verification failed");
  }
}

// Login user
export async function login(data: { username: string; password: string }) {
  try {
    const body = qs.stringify({
      grant_type: "password",
      username: data.username,
      password: data.password,
    });

    const res = await api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || "Login failed");
  }
}

// Get current logged-in user
export async function getCurrentUser(): Promise<User> {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Not authenticated");
  }
}
