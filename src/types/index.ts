export interface Article {
  id: number;
  title: string;
  summary: string;
  url: string;
  image_url?: string;   // <-- make sure this exists
  source: string;
  published_at: string;
  created_at: string;
  updated_at: string;
    content?: string;   // <-- ADD THIS LINE
  timestamp: string; // <- this is important
  view_count?: number; // Add this line

}
export interface Source {
  id: number;
  name: string;
  slug: string;   // <-- REQUIRED
}


// export interface Source {
//   id: number;
//   name: string;
//   slug?: string;
//   base_url?: string;
// }

export interface ArticleStats {
  total_articles: number;
  sources: string[];
  latest_article_date: string | null;
  articles_by_source: Record<string, number>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface WebSocketMessage {
  type: 'latest_articles' | 'stats' | 'news_update' | 'error';
  data?: any;
  message?: string;
}

export interface FilterOptions {
  source?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;

}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  database: string;
  cache: string;
  total_articles: number;
  recent_articles: number;
  timestamp: string;
  error?: string;
}

export interface ScrapingTask {
  message: string;
  task_id: string;
  status: string;
}
// --- Core Data Models ---

export interface Source {
  id: number;
  name: string;
  slug: string;   // REQUIRED for API filtering and SourceList
  base_url?: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  url: string;
  image_url?: string; // Corresponds to the image_url field in the Django model
  source: string;     // Represents the source name or slug (from Django serializer 'source_name')
  published_at: string; // The article's original publication timestamp
  created_at: string;   // When the article was saved to the database
  updated_at: string;
  content?: string;     // Full content, typically available on the detail view
  categories?: Category[]; // Array of categories
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

// --- API Response Structures ---

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ArticleStats {
  total_articles: number;
  sources: string[];
  latest_article_date: string | null;
  articles_by_source: Record<string, number>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  database: string;
  cache: string;
  total_articles: number;
  recent_articles: number;
  timestamp: string;
  error?: string;
}

export interface ScrapingTask {
  message: string;
  task_id: string;
  status: string;
}

// --- API Request/Filter Structures ---

export interface FilterOptions {
  source?: string; // Filter by source slug
  search?: string; // Search query
  date_from?: string; // Start date for filtering
  date_to?: string;   // End date for filtering
  page?: number;
  page_size?: number;
}

// --- WebSocket Messages ---

export interface WebSocketMessage {
  type: 'latest_articles' | 'stats' | 'news_update' | 'error';
  data?: any;
  message?: string;
}