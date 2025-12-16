import React from "react";
import { Article } from "../../types";

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  onArticleClick: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading, onArticleClick }) => {
  if (loading) return <p>Loading articles...</p>;
  if (!articles.length) return <p>No articles found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div
          key={article.id}
          onClick={() => onArticleClick(article)}
          className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
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
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
