// ArticleCard.tsx
import React from 'react';
import { Article } from '../../types';
import { ExternalLink, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: Article & { view_count?: number }; // <-- add view_count
  onClick?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'bbc_news': 'bg-red-100 text-red-800',
      'cnn_news': 'bg-blue-100 text-blue-800',
      'inshorts': 'bg-green-100 text-green-800',
      'hindustan_times': 'bg-orange-100 text-orange-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  const getSourceName = (source: any) => {
    if (!source) return "Unknown";
    if (typeof source === "object") return source.name || "Unknown";
    if (typeof source === "string") return source.replace("_", " ").toUpperCase();
    return "Unknown";
  };

  return (
    <div 
      className="news-card card p-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      {article.image_url && (
        <img 
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => (e.currentTarget.style.display = "none")} 
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {formatDate(article.timestamp)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
        {article.title}
      </h3>

      {/* Summary */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {article.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          {article.view_count !== undefined && (
            <span>🔥 {article.view_count} clicks</span>
          )}
          <span>ID: {article.id}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          Read Full Article
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
