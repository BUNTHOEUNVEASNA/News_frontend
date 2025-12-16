import React, { useEffect, useState, useCallback } from "react";
// Assuming AuthContext provides user, refreshUser, and possibly an error state
import { useAuth } from "../context/AuthContext"; 

/**
 * Renders the user's profile details.
 * Fetches the latest user data upon mount.
 */
export default function ProfilePage() {
  // Destructure necessary values from the authentication context
  const { user, refreshUser } = useAuth();
  
  // State for tracking the data fetching process
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function to handle the refresh logic, includes state updates
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null); // Clear previous errors
    
    try {
      // Assuming refreshUser is an async function that updates the context
      await refreshUser(); 
    } catch (err) {
      // Catch errors during the refresh process (e.g., network failure)
      console.error("Failed to refresh user data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUser]); // Dependency array includes refreshUser from context

  // Effect to run the initial data fetch when the component mounts
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // --- RENDERING LOGIC ---

  // 1. Initial Loading State
  if (isRefreshing && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="ml-4 text-indigo-600 text-lg">Loading Profile...</p>
      </div>
    );
  }

  // 2. Not Logged In (No user data after initial check)
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          Access Denied: You are not logged in.
        </p>
      </div>
    );
  }

  // 3. Main Profile View
  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 border-b pb-4">
        👤 User Profile
      </h1>

      {/* Error Message Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span className="font-semibold text-gray-700">Username:</span>
          <span className="text-lg text-gray-900 font-medium">
            {user.username}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-lg text-gray-900 font-medium truncate">
            {user.email}
          </span>
        </div>
        
        {/* You can add more profile fields here */}
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span className="font-semibold text-gray-700">Role:</span>
          <span className="text-lg text-gray-900 font-medium">
            {user.role || "Standard User"} 
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`
            px-8 py-3 text-white rounded-full font-bold shadow-lg 
            transition duration-300 ease-in-out transform hover:scale-[1.02]
            ${isRefreshing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300'}
          `}
        >
          {isRefreshing ? 'Refreshing...' : '✨ Refresh Data'}
        </button>
      </div>
    </div>
  );
}