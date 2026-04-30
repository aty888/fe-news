import { Rss, Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Rss size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">FE</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {" "}
                  News
                </span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
              프론트엔드 개발자를 위한 최신 뉴스, 트렌드, 그리고 지식을
              한곳에서.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            © {new Date().getFullYear()} FE News. Made with{" "}
            <Heart
              size={14}
              className="text-accent-500 fill-accent-500 animate-pulse-soft"
            />{" "}
            for developers.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50">
              React
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50">
              TypeScript
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50">
              Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
