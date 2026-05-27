import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useArticles } from './hooks/useArticles';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SearchModal from './components/SearchModal/SearchModal';
import HomePage from './pages/HomePage/HomePage';
import NewsPage from './pages/NewsPage/NewsPage';
import TutorialsPage from './pages/TutorialsPage/TutorialsPage';
import ReleasesPage from './pages/ReleasesPage/ReleasesPage';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage';
import ClaudeCodePage from './pages/ClaudeCodePage/ClaudeCodePage';

function AppInner() {
  const { articles, featured, filter, setFilter, isLoading } = useArticles();
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const sharedProps = {
    articles,
    filter,
    setFilter,
    isLoading,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                {...sharedProps}
                featured={featured}
              />
            }
          />
          <Route path="/news" element={<NewsPage {...sharedProps} />} />
          <Route path="/tutorials" element={<TutorialsPage {...sharedProps} />} />
          <Route path="/releases" element={<ReleasesPage {...sharedProps} />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/claude-code" element={<ClaudeCodePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
