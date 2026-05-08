import { Sun, Moon, Rss, Github, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface NavbarProps {
  onSearchOpen?: () => void;
  bookmarkCount?: number;
}

export default function Navbar({
  onSearchOpen,
  bookmarkCount = 0,
}: NavbarProps) {
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "홈" },
    { to: "/news", label: "뉴스" },
    { to: "/tutorials", label: "튜토리얼" },
    { to: "/releases", label: "릴리즈" },
    { to: "/resources", label: "필수 리소스" },
    { to: "/bookmarks", label: "북마크" },
    { to: "/board", label: "게시판" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b glass border-slate-200/50 dark:border-slate-800/50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="flex gap-4 items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-br rounded-xl shadow-lg transition-transform duration-200 from-brand-500 to-accent-500 group-hover:scale-110">
              <Rss size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">FE</span>
              <span className="text-slate-800 dark:text-slate-200"> News</span>
            </span>
          </Link>

          {/* Nav Links (desktop) */}
          <nav className="hidden gap-1 items-center ml-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {link.label}
                {link.to === "/bookmarks" && bookmarkCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex gap-2 items-center">
            <button
              onClick={onSearchOpen}
              className="btn-ghost text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title="검색 (⌘K)"
            >
              <Search size={18} />
              <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 font-mono">
                ⌘K
              </span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Github size={18} />
            </a>

            <button
              onClick={toggleTheme}
              className="btn-ghost text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title={isDark ? "라이트 모드" : "다크 모드"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 md:hidden btn-ghost text-slate-500 dark:text-slate-400"
            >
              <div className="flex flex-col gap-1 w-5">
                <span
                  className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="pt-2 pb-4 mt-1 border-t md:hidden border-slate-200/50 dark:border-slate-800/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                  isActive(link.to)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {link.label}
                {link.to === "/bookmarks" && bookmarkCount > 0 && (
                  <span className="inline-flex justify-center items-center ml-auto w-5 h-5 text-xs font-bold text-white rounded-full bg-brand-500">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
