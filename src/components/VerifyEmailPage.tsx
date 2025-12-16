import React, { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface VerifyEmailPageProps {
  setView: (view: "login" | "register" | "verify") => void;
  setMessage: (msg: { type: string; content: string } | null) => void;
}

export default function VerifyEmailPage({ setView, setMessage }: VerifyEmailPageProps) {
  const { verifyEmail } = useAuth();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await verifyEmail(token);

      setMessage({
        type: "success",
        content: "Verification successful. You can now log in.",
      });

      setView("login");
    } catch (err: any) {
      setMessage({
        type: "error",
        content: err.message || "Verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setToken(e.target.value);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-extrabold mb-4">Email Verification</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={token}
          onChange={handleChange}
          placeholder="Verification Token"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg">
          {loading ? <LoadingSpinner /> : "Activate Account"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button type="button" onClick={() => setView("login")} className="text-indigo-600">
          Back to Login
        </button>
      </div>
    </div>
  );
}
