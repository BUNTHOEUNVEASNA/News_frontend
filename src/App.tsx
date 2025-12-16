import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ArticleDetails from "./pages/ArticleDetails";
import AdminScrapePage from "./pages/AdminScrapePage";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import TrendingPage from "./pages/TrendingPage"; // add trending page

import NewsFeed from "./pages/NewsFeed";
import Dashboard from "./components/Dashboard";
import Settings from "./pages/Settings";
import MyBookmarks from "./pages/MyBookmarks";
import ProfilePage from "./pages/Settings";
const AppWrapper = () => {
  const location = useLocation();

  // Routes that do NOT use the main AppLayout (e.g., full-page auth forms)
  const hideLayoutRoutes = ["/login", "/register", "/verify"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  // The hideLayout logic should only contain the routes that need the layout hidden.
  return hideLayout ? (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  ) : (
    // All other routes (including admin) should be wrapped in AppLayout
    <AppLayout>
      <Routes>
        {/* MOVED: The /admin/scrape route is now only defined here, 
        along with the rest of the main application pages.
        */}
        <Route path="/admin/scrape" element={<AdminScrapePage />} /> 

        {/* Main Application Routes */}
        <Route path="/" element={<NewsFeed />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookmarking" element={<MyBookmarks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trending" element={<TrendingPage />} /> {/* Trending Page */}

        <Route path="/article/:id" element={<ArticleDetails />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}