import React, { useState } from 'react';
import { articlesAPI } from '../api'; // Adjust the import path as needed
import { Article } from '../types';
interface ScrapeResult {
  article: Article | null;
  error: string | null;
  loading: boolean;
}

const AdminScrapePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ScrapeResult>({ article: null, error: null, loading: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setResult({ article: null, error: null, loading: true });

    try {
      const newArticle = await articlesAPI.scrapeSingleArticle(url);
      setResult({ article: newArticle, error: null, loading: false });
      setUrl(''); // Clear the input on success
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An unknown error occurred.';
      setResult({ article: null, error: errorMessage, loading: false });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>📰 Single Article Scraper (Admin)</h2>
      <p>Paste the full URL of the article you wish to scrape and save to the database.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://example.com/article-title"
          required
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={result.loading}
          style={{ padding: '10px 20px', backgroundColor: result.loading ? '#aaa' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {result.loading ? 'Scraping...' : 'Scrape & Save'}
        </button>
      </form>

      {result.error && (
        <p style={{ color: 'red', marginTop: '15px', border: '1px solid red', padding: '10px', backgroundColor: '#fee' }}>
          **Error:** {result.error}
        </p>
      )}

      {result.article && (
        <div style={{ marginTop: '15px', border: '1px solid green', padding: '10px', backgroundColor: '#efe' }}>
          <h3>✅ Scrape Successful!</h3>
          <p><strong>ID:</strong> {result.article.id}</p>
          <p><strong>Title:</strong> {result.article.title}</p>
          <p><strong>Source:</strong> {result.article.source}</p>
        </div>
      )}
    </div>
  );
};

export default AdminScrapePage;