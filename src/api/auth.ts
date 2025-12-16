// src/api/auth.ts
export const API_BASE = "http://127.0.0.1:8000/api";

// ---------------- TOKEN HELPERS ----------------
export const getTokens = () => ({
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
});

export const saveTokens = (access?: string, refresh?: string) => {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};

export const clearAuth = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ---------------- SAFE JSON ----------------
export const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Server did not return JSON");
  }
};

// ---------------- AUTH FETCH (AUTO REFRESH) ----------------
export const authFetch = async (
  url: string,
  method: string = "GET",
  body: any = null
) => {
  let { access, refresh } = getTokens();

  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };

  let res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // Auto-refresh if access expired
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      clearAuth();
      throw new Error("Session expired");
    }

    const data = await safeJson(refreshRes);
    saveTokens(data.access, refresh);

    headers = {
      ...headers,
      Authorization: `Bearer ${data.access}`,
    };

    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  }

  return res;
};
