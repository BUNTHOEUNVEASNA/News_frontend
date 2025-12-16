import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ If already logged in, redirect
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* AuthForm handles register internally */}
      <AuthForm />
    </div>
  );
}
