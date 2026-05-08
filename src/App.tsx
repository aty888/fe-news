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
import BookmarksPage from './pages/BookmarksPage/BookmarksPage';
import BoardPage from './pages/BoardPage/BoardPage';
import BoardFormPage from './pages/BoardPage/BoardFormPage';
import BoardDetailPage from './pages/BoardPage/BoardDetailPage';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage';

function AppInner() {
  const { articles, featured, filter, setFilter, toggleBookmark, bookmarks, isLoading } = useArticles();
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
    onToggleBookmark: toggleBookmark,
    isLoading,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        bookmarkCount={bookmarks.size}
      />

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
          <Route
            path="/bookmarks"
            element={
              <BookmarksPage
                articles={articles}
                onToggleBookmark={toggleBookmark}
              />
            }
          />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/create" element={<BoardFormPage />} />
          <Route path="/board/edit/:id" element={<BoardFormPage />} />
          <Route path="/board/:id" element={<BoardDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
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
