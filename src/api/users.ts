// src/api/users.ts
import { API_BASE, safeJson, authFetch, saveTokens } from "./auth";

// ---------- LOGIN ----------
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const data = await safeJson(res);
  saveTokens(data.access, data.refresh);
  return data;
};

// ---------- PROFILE ----------
export const fetchProfile = async () => {
  const res = await authFetch(`${API_BASE}/users/profile/`);
  if (!res.ok) throw new Error("Unauthorized");
  return safeJson(res);
};
// ---------- REGISTER ----------
export const register = async (payload: { username: string; email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.detail || "Registration failed");
  }
};

// ---------- VERIFY EMAIL ----------
export const verifyEmail = async (token: string) => {
  const res = await fetch(`${API_BASE}/users/verify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) throw new Error("Invalid verification token");
};
