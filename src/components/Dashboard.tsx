import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user,  logout } = useAuth();

  if (!user) {
    return <div className="p-6">Not authenticated</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user.username}
      </h1>

      <p>Email: {user.email}</p>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
