import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        News Aggregator
      </Link>

      <nav className="space-x-4">
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/bookmarking">Bookmarking</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/settings">Settings</Link>
          </>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
