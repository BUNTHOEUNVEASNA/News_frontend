import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Article, FilterOptions, PaginatedResponse, Source } from "../types";
import ArticleList from "../components/News/ArticleList";
import FilterBar from "../components/News/FilterBar";
import Pagination from "../components/UI/Pagination";
import { Play, Pause } from "lucide-react";
import { API_BASE_URL } from "../api/config";

const NewsFeed: React.FC = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    page_size: 12,
    source: "",
  });

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // -------------------------
  // FETCH ARTICLES
  // -------------------------
  const fetchArticles = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(filters.page));
    params.append("page_size", String(filters.page_size));
    if (filters.search) params.append("search", filters.search);
    if (filters.source) params.append("source", String(filters.source));
    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);

    const url = `${API_BASE_URL}/api/articles/?${params.toString()}`;

    // ✅ Add token only if user is logged in
    const token = localStorage.getItem("access");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    const data: PaginatedResponse<Article> = await res.json();

    setArticles(data.results || []);
    const total = Math.ceil(data.count / (filters.page_size ?? 12));
    setPagination({
      count: data.count,
      next: data.next,
      previous: data.previous,
      currentPage: filters.page ?? 1,
      totalPages: total,
    });
    setLoading(false);
  } catch (err) {
    console.error("Failed to load articles:", err);
    setError("Failed to load articles");
    setLoading(false);
  }
};

  // -------------------------
  // FETCH SOURCES
  // -------------------------
  useEffect(() => {
    const loadSources = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news-sources/`);
        const data = await res.json();
        setSources(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Failed to load sources:", err);
        setSources([]);
      }
    };
    loadSources();
  }, []);

  // -------------------------
  // RECORD ARTICLE CLICK AND NAVIGATE
  // -------------------------
  // -------------------------
// RECORD ARTICLE CLICK AND NAVIGATE
// -------------------------
const handleArticleClick = async (article: Article) => {
  try {
    const token = localStorage.getItem("access");

    // Only record click if logged in
    if (token) {
      await fetch(`${API_BASE_URL}/articles/${article.id}/click/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistically update view_count
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id
            ? { ...a, view_count: (a.view_count ?? 0) + 1 }
            : a
        )
      );
    }

    // Navigate to ArticleDetails page for everyone
    navigate(`/article/${article.id}`);
  } catch (err) {
    console.error("Failed to record article click:", err);
    navigate(`/article/${article.id}`); // still navigate
  }
};


  // -------------------------
  // REFETCH WHEN FILTERS CHANGE
  // -------------------------
  useEffect(() => {
    fetchArticles();
  }, [filters]);

  // -------------------------
  // CLEANUP AUTO REFRESH
  // -------------------------
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRefresh = () => fetchArticles();

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) clearInterval(refreshInterval);
      setRefreshInterval(null);
      setAutoRefresh(false);
    } else {
      const interval = setInterval(fetchArticles, 30000);
      setRefreshInterval(interval);
      setAutoRefresh(true);
    }
  };

  // -------------------------
  // RENDER UI
  // -------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>
          <p className="text-gray-600 mt-2">Latest articles from multiple news sources</p>
        </div>

        <button
          onClick={toggleAutoRefresh}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            autoRefresh ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}</span>
        </button>
      </div>

      {/* FILTERS */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        loading={loading}
        sources={sources}
      />

      {/* ARTICLE LIST */}
      <ArticleList
        articles={articles}
        loading={loading}
        onArticleClick={handleArticleClick} // now navigates to ArticleDetails
      />

      {/* PAGINATION */}
      {!loading && articles.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={!!pagination.next}
            hasPrevious={!!pagination.previous}
          />
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
