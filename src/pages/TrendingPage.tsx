// TrendingPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Article } from "../types";
import { authFetch, API_BASE } from "../api/auth";
import { motion } from "framer-motion";

const TrendingPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await authFetch(`${API_BASE}/trending/`);
        if (!res.ok) throw new Error("Failed to fetch trending articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleArticleClick = async (article: Article) => {
    navigate(`/article/${article.id}`);

    try {
      await authFetch(`${API_BASE}/articles/${article.id}/click/`, "POST");
    } catch (err) {
      console.error("Failed to record article click:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading trending articles...</p>
      </div>
    );

  if (!articles.length)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-gray-600 text-lg mb-4">No trending articles found.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Back to News Feed
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to News Feed
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Trending Articles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <motion.div
            key={article.id}
            onClick={() => handleArticleClick(article)}
            className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
            )}

            <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(article.timestamp).toLocaleDateString()} •{" "}
              <span className="font-medium">{article.view_count ?? 0} views</span>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
