import { useState, useMemo, useEffect } from "react";

import type { Article, Category, ContentType } from "../types";

export interface FilterState {
  search: string;
  category: Category | "All";
  type: ContentType | "All";
  bookmarked: boolean;
  language: "All" | "ko" | "en";
}

// 텍스트에 한글이 포함되어 있는지 확인하여 언어 판별
function detectLanguage(title: string = "", summary: string = ""): "ko" | "en" {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  if (koreanRegex.test(title) || koreanRegex.test(summary)) {
    return "ko";
  }
  return "en";
}

// 외부 태그를 새로운 Category 타입으로 매핑하는 헬퍼 함수
function mapDevToCategory(tags: string[]): Category {
  const t = tags.join(",").toLowerCase();
  
  if (t.includes("react") || t.includes("vue") || t.includes("svelte") || t.includes("next") || t.includes("nuxt") || t.includes("angular")) return "Frameworks";
  if (t.includes("typescript") || t.includes("ts")) return "TypeScript";
  if (t.includes("css") || t.includes("tailwind") || t.includes("ui") || t.includes("ux") || t.includes("design")) return "Styling";
  if (t.includes("performance") || t.includes("optimization")) return "Performance";
  if (t.includes("architecture") || t.includes("pattern") || t.includes("system")) return "Architecture";
  if (t.includes("tooling") || t.includes("vite") || t.includes("webpack") || t.includes("node") || t.includes("npm") || t.includes("git")) return "Tooling";
  if (t.includes("web") || t.includes("browser") || t.includes("dom") || t.includes("html")) return "Web/Browser";
  if (t.includes("ai") || t.includes("gpt") || t.includes("copilot") || t.includes("llm")) return "AI/Trends";
  if (t.includes("career") || t.includes("interview") || t.includes("job") || t.includes("culture")) return "Career";
  
  return "JavaScript";
}

// 태그와 제목을 기반으로 ContentType을 자동 분류하는 헬퍼 함수
function getArticleType(tags: string[], title: string = ""): ContentType {
  const t = [...tags, title].join(",").toLowerCase();
  if (t.includes("release") || t.includes("version") || t.includes("v1") || t.includes("v2") || t.includes("v3") || t.includes("v4") || t.includes("v5")) return "release";
  if (t.includes("news") || t.includes("update") || t.includes("announcement") || t.includes("week")) return "news";
  if (t.includes("discussion") || t.includes("opinion") || t.includes("watercooler") || t.includes("why") || t.includes("should")) return "discussion";
  if (t.includes("tip") || t.includes("trick") || t.includes("hack") || t.includes("short")) return "tip";
  return "tutorial";
}

export function useArticles() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("fe-news-bookmarks");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "All",
    type: "All",
    bookmarked: false,
    language: "All",
  });

  const [fetchedArticles, setFetchedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApis() {
      setIsLoading(true);
      let results: Article[] = [];

      // 1. KOFE Article (Substack RSS 피드) — 오전/오후 각 1회 캐싱
      try {
        const KOFE_CACHE_KEY = "fe-news-kofe-cache";
        const KOFE_PERIOD_KEY = "fe-news-kofe-cache-period";

        const now = new Date();
        const datePart = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const halfPart = now.getHours() < 12 ? "AM" : "PM";
        const currentPeriod = `${datePart}-${halfPart}`;

        const cachedPeriod = localStorage.getItem(KOFE_PERIOD_KEY);
        const cachedKofe = localStorage.getItem(KOFE_CACHE_KEY);
        const isKofeCacheValid = cachedPeriod === currentPeriod && cachedKofe !== null;

        let kofeItems: any[] = [];

        if (isKofeCacheValid) {
          kofeItems = JSON.parse(cachedKofe!);
        } else {
          const subRes = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fkofearticle.substack.com%2Ffeed&num=20"
          );
          if (subRes.ok) {
            const data = await subRes.json();
            if (data.items && Array.isArray(data.items)) {
              kofeItems = data.items;
              localStorage.setItem(KOFE_CACHE_KEY, JSON.stringify(kofeItems));
              localStorage.setItem(KOFE_PERIOD_KEY, currentPeriod);
            }
          }
        }

        kofeItems.forEach((post: any) => {
          if (!post) return;
          const plainTextDesc = post.description?.replace(/<[^>]*>?/gm, "").trim();
          results.push({
            id: `sub-${post.guid || Math.random()}`,
            title: post.title || "No Title",
            summary: plainTextDesc ? plainTextDesc.substring(0, 150) + "..." : "",
            category: mapDevToCategory([post.title || "", "Frontend"]),
            type: getArticleType(["Frontend", "Substack"], post.title),
            author: post.author || "KOFE",
            publishedAt: post.pubDate || new Date().toISOString(),
            readTime: 5,
            url: post.link || "#",
            tags: ["Frontend", "Substack"],
            imageUrl: post.thumbnail || "",
            likes: 0,
            views: 0,
            isFeatured: true,
          });
        });
      } catch (error) {
        console.error("KOFE Substack RSS 연동 실패:", error);
      }


      // 2. Dev.to API (캐싱 적용 및 요청 최적화)
      try {
        const CACHE_KEY = "fe-news-devto-cache";
        const CACHE_TIME_KEY = "fe-news-devto-cache-time";
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
        
        // 5분(300,000ms) 동안 캐시 유효
        const isCacheValid = cachedTime && Date.now() - parseInt(cachedTime) < 300000;

        if (cachedData && isCacheValid) {
          const devData = JSON.parse(cachedData);
          devData.forEach((post: any) => {
            if (!post) return;
            results.push({
              id: `dev-${post.id}`,
              title: post.title || "No Title",
              summary: post.description || "",
              category: mapDevToCategory(post.tag_list || []),
              type: getArticleType(post.tag_list || [], post.title),
              author: post.user?.name || "Dev.to User",
              publishedAt: post.published_timestamp || post.published_at || new Date().toISOString(),
              readTime: post.reading_time_minutes || 5,
              url: post.url || "#",
              tags: post.tag_list || [],
              imageUrl: post.cover_image || post.social_image,
              likes: post.public_reactions_count || 0,
              views: post.page_views_count || 0,
            });
          });
        } else {
          // 태그를 핵심적인 4개로 축소하여 요청 횟수 절감
          const devTags = ["frontend", "webdev", "javascript", "react"];
          const devPromises = devTags.map((tag) =>
            fetch(`https://dev.to/api/articles?tag=${tag}&per_page=15`).then(
              (res) => (res.ok ? res.json() : [])
            )
          );
          const devResultsArray = await Promise.all(devPromises);
          const devData = devResultsArray.flat();
          
          if (Array.isArray(devData)) {
            // 중복 제거 (여러 태그에 걸린 게시물)
            const seenIds = new Set();
            const uniqueDevData = devData.filter(post => {
              if (!post || seenIds.has(post.id)) return false;
              seenIds.add(post.id);
              return true;
            });

            uniqueDevData.forEach((post: any) => {
              results.push({
                id: `dev-${post.id}`,
                title: post.title || "No Title",
                summary: post.description || "",
                category: mapDevToCategory(post.tag_list || []),
                type: getArticleType(post.tag_list || [], post.title),
                author: post.user?.name || "Dev.to User",
                publishedAt: post.published_timestamp || post.published_at || new Date().toISOString(),
                readTime: post.reading_time_minutes || 5,
                url: post.url || "#",
                tags: post.tag_list || [],
                imageUrl: post.cover_image || post.social_image,
                likes: post.public_reactions_count || 0,
                views: post.page_views_count || 0,
              });
            });

            // 캐시에 저장
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(uniqueDevData));
            sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          }
        }
      } catch (error) {
        console.error("Dev.to API 연동 실패:", error);
      }

      // 3. FreeCodeCamp News (RSS2JSON API 사용)
      try {
        const fccRes = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://www.freecodecamp.org/news/rss/&num=20",
        );
        if (fccRes.ok) {
          const fccData = await fccRes.json();
          if (fccData.items && Array.isArray(fccData.items)) {
            fccData.items.forEach((post: any) => {
              if (!post) return;
              results.push({
                id: `fcc-${post.guid || Math.random()}`,
                title: post.title,
                summary:
                  post.description
                    ?.replace(/<[^>]*>?/gm, "")
                    .substring(0, 150) + "...", // HTML 태그 제거
                category: mapDevToCategory(
                  (post.categories || []).concat([post.title || ""])
                ),
                type: getArticleType(post.categories || [], post.title),
                author: post.author || "freeCodeCamp",
                publishedAt: post.pubDate || new Date().toISOString(),
                readTime: 7,
                url: post.link || "#",
                tags: post.categories || ["Frontend"],
                imageUrl: post.thumbnail,
                likes: 0,
                views: 0,
              });
            });
          }
        }
      } catch (error) {
        console.error("FCC API 연동 실패:", error);
      }

      // 4. 다양한 기술 블로그 및 뉴스 RSS 피드 병렬 호출 (RSS2JSON)
      const extraRssFeeds = [
        {
          url: "https://toss.tech/rss.xml",
          author: "Toss Tech",
          category: "Architecture",
          type: "tutorial",
        },
        {
          url: "https://techblog.woowahan.com/feed/",
          author: "우아한형제들",
          category: "Architecture",
          type: "tutorial",
        },
        {
          url: "https://tech.kakao.com/feed/",
          author: "Kakao Tech",
          category: "Web/Browser",
          type: "tutorial",
        },
        {
          url: "https://d2.naver.com/d2.atom",
          author: "Naver D2",
          category: "Architecture",
          type: "tutorial",
        },
        {
          url: "https://engineering.linecorp.com/ko/feed/",
          author: "LINE Engineering",
          category: "Performance",
          type: "tutorial",
        },
        {
          url: "https://react.dev/rss.xml",
          author: "React Blog",
          category: "Frameworks",
          type: "release",
        },
        {
          url: "https://css-tricks.com/feed/",
          author: "CSS-Tricks",
          category: "Styling",
          type: "tutorial",
        },
      ];

      try {
        const rssPromises = extraRssFeeds.map((feed) =>
          fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&num=15`,
          ).then((res) => (res.ok ? res.json() : Promise.reject("Failed"))),
        );

        const rssResponses = await Promise.allSettled(rssPromises);

        rssResponses.forEach((res, index) => {
          if (res.status === "fulfilled" && res.value.items) {
            const feedMeta = extraRssFeeds[index];
            res.value.items.forEach((post: any) => {
              if (!post) return;
              // 너무 긴 설명글 방지 (HTML 태그 제거)
              const plainTextDesc = post.description
                ?.replace(/<[^>]*>?/gm, "")
                .trim();

              results.push({
                id: `rss-${feedMeta.author}-${post.guid || Math.random()}`,
                title: post.title,
                summary: plainTextDesc
                  ? plainTextDesc.substring(0, 150) + "..."
                  : "",
                category: mapDevToCategory([
                  post.title || "",
                  plainTextDesc || "",
                  feedMeta.category,
                ]),
                type: getArticleType(post.categories || [feedMeta.type], post.title),
                author: post.author || feedMeta.author,
                publishedAt: post.pubDate || new Date().toISOString(),
                readTime: 6,
                url: post.link || "#",
                tags: post.categories?.length
                  ? post.categories.slice(0, 3)
                  : [feedMeta.category],
                imageUrl: post.thumbnail || "",
                likes: Math.floor(Math.random() * 50),
                views: Math.floor(Math.random() * 1000) + 100, // 가짜 조회수
                isFeatured:
                  feedMeta.author === "GeekNews" && Math.random() > 0.5, // 긱뉴스 일부 추천
              });
            });
          }
        });
      } catch (error) {
        console.error("추가 RSS 피드 병렬 연동 중 오류 발생:", error);
      }

      // 데이터 병합 (결과 배열)
      const merged = [...results];

      // 날짜순 정렬 (유효하지 않은 날짜 처리)
      merged.sort((a, b) => {
        const timeA = new Date(a.publishedAt).getTime();
        const timeB = new Date(b.publishedAt).getTime();
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });

      // 중복 ID 방지 (선택 사항)
      const uniqueMap = new Map();
      merged.forEach((item) => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      setFetchedArticles(Array.from(uniqueMap.values()));
      setIsLoading(false);
    }

    fetchApis();
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("fe-news-bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  const articles = useMemo<Article[]>(() => {
    let result = fetchedArticles.map((a) => ({
      ...a,
      isBookmarked: bookmarks.has(a.id),
    }));

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.author.toLowerCase().includes(q),
      );
    }

    if (filter.category !== "All") {
      result = result.filter((a) => a.category === filter.category);
    }

    if (filter.type !== "All") {
      result = result.filter((a) => a.type === filter.type);
    }

    if (filter.bookmarked) {
      result = result.filter((a) => a.isBookmarked);
    }

    if (filter.language !== "All") {
      result = result.filter((a) => {
        const lang = a.language || detectLanguage(a.title, a.summary);
        return lang === filter.language;
      });
    }

    return result;
  }, [bookmarks, filter, fetchedArticles]);

  const featured = useMemo(
    () => fetchedArticles.filter((a) => a.isFeatured).slice(0, 4),
    [fetchedArticles],
  );

  return {
    articles,
    featured,
    filter,
    setFilter,
    toggleBookmark,
    bookmarks,
    isLoading,
  };
}
