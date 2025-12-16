import axios from 'axios';
// Import all necessary types from the separate types file
import { 
    Article, 
    ArticleStats, 
    PaginatedResponse, 
    FilterOptions, 
    HealthStatus, 
    ScrapingTask, 
    Source 
} from '../types';

// --- API Configuration ---

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request/Response Interceptors ---

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log a more informative error message
    const errorMessage = error.response?.data?.error || error.response?.data?.detail || error.message;
    console.error('API Response Error:', errorMessage);
    return Promise.reject(error);
  }
);

// --- Exported API Objects ---

export const sourcesAPI = {
  // Fetches all available news sources
  getSources: async (): Promise<Source[]> => {
    const response = await api.get('/sources/');
    return response.data;
  },
};

export const articlesAPI = {
  // Get all articles with optional filters
  getArticles: async (filters: FilterOptions = {}): Promise<PaginatedResponse<Article>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/articles/?${params.toString()}`);
    return response.data;
  },

  // Get single article by ID
  getArticle: async (id: number): Promise<Article> => {
    const response = await api.get(`/articles/${id}/`);
    return response.data;
  },

  // Get article statistics
  getStats: async (): Promise<ArticleStats> => {
    const response = await api.get('/articles/stats/');
    return response.data;
  },

  // Get latest articles (last 24 hours)
  getLatest: async (): Promise<Article[]> => {
    const response = await api.get('/articles/latest/');
    return response.data;
  },

  // Trigger manual bulk scraping
  triggerScraping: async (): Promise<ScrapingTask> => {
    const response = await api.post('/articles/scrape/');
    return response.data;
  },

  // NEW FUNCTION: Scrape a single article by URL (for admin page)
  scrapeSingleArticle: async (url: string): Promise<Article> => {
    // Corresponds to the new 'articles/scrape-single/' endpoint
    const response = await api.post('/articles/scrape-single/', { url });
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<HealthStatus> => {
    const response = await api.get('/articles/health/');
    return response.data;
  },
};

// --- Default Export ---

export default api;