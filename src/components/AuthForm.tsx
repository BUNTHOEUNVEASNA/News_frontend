import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const { login, register } = useAuth();
  const [view, setView] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (view === "login") await login(username, password);
      else await register(username, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 w-full"
        required
      />

      {view === "register" && (
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
      )}

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full"
        required
      />

      {error && <p className="text-red-600">{error}</p>}

      <button className="bg-indigo-600 text-white p-2 w-full rounded">
        {view === "login" ? "Login" : "Register"}
      </button>

      <p className="text-center text-sm">
        {view === "login" ? (
          <button type="button" onClick={() => setView("register")} className="text-indigo-600">
            Create account
          </button>
        ) : (
          <button type="button" onClick={() => setView("login")} className="text-indigo-600">
            Already registered?
          </button>
        )}
      </p>
    </form>
  );
}
