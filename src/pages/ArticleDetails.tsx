import { ArrowLeft, ExternalLink, Clock, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Article } from "../types";
import { sourc_API } from "../api/config";
import { formatDate } from "../utils/formatDate";
import { authFetch, API_BASE } from "../api/auth";
import { motion } from "framer-motion";

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
      const fetchArticleAndBookmark = async () => {
        try {
          // Fetch article
          const res = await fetch(`${sourc_API}/api/articles/${id}/`);
          if (!res.ok) throw new Error("Failed to fetch article");
          const data = await res.json();
          setArticle(data);

          // ✅ Fetch bookmark status AFTER article loaded
          const bookmarkRes = await authFetch(`${API_BASE}/bookmarks/check/?article_id=${id}`);
          if (bookmarkRes.ok) {
            const bookmarkData = await bookmarkRes.json();
            setBookmarked(Boolean(bookmarkData.is_bookmarked)); // convert to true/false
          } else {
            setBookmarked(false);
          }
        } catch (err) {
          console.error(err);
          setBookmarked(false);
        } finally {
          setLoading(false);
        }
      };

      fetchArticleAndBookmark();
    }, [id]);


  const handleBookmark = async () => {
    if (!article || saving) return;
    setSaving(true);

    try {
      if (bookmarked) {
        // DELETE bookmark
        const res = await authFetch(`${API_BASE}/bookmarks/${article.id}/`, "DELETE");
        if (!res.ok) throw new Error("Failed to remove bookmark");
        setBookmarked(false);
      } else {
        // POST bookmark
        const res = await authFetch(`${API_BASE}/bookmarks/`, "POST", { article: article.id });
        if (!res.ok) throw new Error("Failed to save bookmark");
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
      alert("Please login to manage bookmarks.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-10" />
        <div className="h-80 bg-gray-200 rounded-xl" />
      </div>
    );

  if (!article)
    return <p className="p-6 text-center text-red-600">Article not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-5 py-12"
    >
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to News Feed
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{article.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(article.timestamp)}
          </div>

          <button
            onClick={handleBookmark}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              bookmarked
                ? "border-yellow-400 bg-yellow-50 text-yellow-600"
                : "border-gray-300 hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Star
              className={`w-5 h-5 transition ${
                bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
            />
            <span className="text-sm font-medium">{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Article Image */}
      {article.image_url && (
        <motion.img
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          src={article.image_url}
          alt={article.title}
          className="w-full h-[420px] object-cover rounded-2xl shadow-lg mb-10"
        />
      )}

      {/* Content */}
      {article.content ? (
        <div className="prose prose-lg max-w-none text-gray-900 mb-12">
          {article.content.split("\n").map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic mb-12">
          No additional content available — open the original article below.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Read Original Article
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </motion.div>
  );
};

export default ArticleDetails;
