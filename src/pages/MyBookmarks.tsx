import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Article } from "../types";
import { authFetch, API_BASE } from "../api/auth";

const MyBookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null); // track which is being removed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await authFetch(`${API_BASE}/users/bookmarks/`);
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (articleId: number) => {
    if (removingId) return; // prevent multiple deletes
    setRemovingId(articleId);
    try {
      const res = await authFetch(`${API_BASE}/bookmarks/${articleId}/`, "DELETE");
      if (!res.ok) throw new Error("Failed to remove bookmark");

      // Remove from state immediately
      setBookmarks((prev) => prev.filter((a) => a.id !== articleId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove bookmark. Try again.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading bookmarks...</p>
      </div>
    );

  if (!bookmarks.length)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-gray-600 text-lg mb-4">You have no bookmarked articles.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Back to News Feed
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to News Feed
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookmarks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/article/${article.id}`)}
            className="relative cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
          >
            {/* Remove Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveBookmark(article.id);
              }}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-red-100 transition"
              title="Remove Bookmark"
              disabled={removingId === article.id}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>

            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
            )}

            <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(article.timestamp).toLocaleDateString()}
            </p>

            <p className="text-gray-700 text-sm mt-3 line-clamp-3">{article.summary}</p>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Read Original
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookmarks;
