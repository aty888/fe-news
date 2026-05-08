import { 
  BookOpen, Code, Terminal, Layout, Youtube, CheckCircle, 
  Package, Map, MessageSquare, Globe, PenTool, ExternalLink 
} from 'lucide-react';

const RESOURCE_GROUPS = [
  {
    title: '공식 문서 및 가이드',
    description: '프론트엔드 개발의 바이블, 핵심 기술들의 공식 레퍼런스',
    items: [
      {
        title: 'React Docs',
        desc: '리액트 공식 문서, 가장 정확한 레퍼런스',
        url: 'https://react.dev/',
        icon: <Code size={24} />,
        color: 'from-cyan-400 to-blue-500',
        hoverColor: 'hover:border-cyan-400',
      },
      {
        title: 'Next.js Docs',
        desc: 'React 프레임워크, App Router 공식 가이드',
        url: 'https://nextjs.org/',
        icon: <Layout size={24} />,
        color: 'from-slate-700 to-black',
        hoverColor: 'hover:border-slate-500',
      },
      {
        title: 'TypeScript Docs',
        desc: '안전한 자바스크립트 개발을 위한 필수 가이드',
        url: 'https://www.typescriptlang.org/docs/',
        icon: <Code size={24} />,
        color: 'from-blue-500 to-blue-700',
        hoverColor: 'hover:border-blue-500',
      },
      {
        title: 'Vue.js Docs',
        desc: '진입 장벽이 낮고 강력한 프론트엔드 프레임워크',
        url: 'https://vuejs.org/',
        icon: <Layout size={24} />,
        color: 'from-emerald-400 to-green-600',
        hoverColor: 'hover:border-emerald-400',
      },
      {
        title: 'MDN Web Docs',
        desc: '바닐라 JS, HTML, CSS 웹 표준 기술 교과서',
        url: 'https://developer.mozilla.org/ko/',
        icon: <BookOpen size={24} />,
        color: 'from-indigo-400 to-purple-500',
        hoverColor: 'hover:border-indigo-400',
      },
      {
        title: 'JAVASCRIPT.INFO',
        desc: '모던 자바스크립트 핵심 개념 튜토리얼',
        url: 'https://javascript.info/',
        icon: <Terminal size={24} />,
        color: 'from-yellow-400 to-amber-500',
        hoverColor: 'hover:border-yellow-400',
      },
      {
        title: 'Roadmap.sh',
        desc: '프론트엔드 개발자 학습 로드맵 가이드',
        url: 'https://roadmap.sh/frontend',
        icon: <Map size={24} />,
        color: 'from-brand-400 to-brand-600',
        hoverColor: 'hover:border-brand-500',
      },
    ]
  },
  {
    title: '유용한 도구 및 라이브러리',
    description: '생산성을 극대화시켜주는 프론트엔드 필수 도구 모음',
    items: [
      {
        title: 'shadcn/ui',
        desc: '카피&페이스트 가능한 최고의 접근성 UI',
        url: 'https://ui.shadcn.com/',
        icon: <Layout size={24} />,
        color: 'from-slate-800 to-slate-900',
        hoverColor: 'hover:border-slate-500',
      },
      {
        title: 'Vite',
        desc: '차세대 초고속 프론트엔드 빌드 툴',
        url: 'https://vitejs.dev/',
        icon: <Terminal size={24} />,
        color: 'from-purple-500 to-indigo-500',
        hoverColor: 'hover:border-purple-500',
      },
      {
        title: 'Figma',
        desc: 'UI/UX 디자인 및 프로토타이핑 필수 도구',
        url: 'https://www.figma.com/',
        icon: <PenTool size={24} />,
        color: 'from-pink-500 to-rose-500',
        hoverColor: 'hover:border-pink-500',
      },
      {
        title: 'Tailwind CSS',
        desc: '빠른 스타일링을 위한 Utility-first CSS',
        url: 'https://tailwindcss.com/',
        icon: <PenTool size={24} />,
        color: 'from-sky-400 to-cyan-500',
        hoverColor: 'hover:border-sky-400',
      },
      {
        title: 'Lucide Icons',
        desc: '깔끔하고 가벼운 오픈소스 아이콘 모음',
        url: 'https://lucide.dev/',
        icon: <PenTool size={24} />,
        color: 'from-rose-400 to-red-500',
        hoverColor: 'hover:border-red-400',
      },
      {
        title: 'Bundlephobia',
        desc: 'npm 패키지의 번들 사이즈 확인 사이트',
        url: 'https://bundlephobia.com/',
        icon: <Package size={24} />,
        color: 'from-orange-400 to-amber-500',
        hoverColor: 'hover:border-orange-400',
      },
      {
        title: 'Can I use',
        desc: 'CSS, JS 기능의 브라우저 호환성 체크',
        url: 'https://caniuse.com/',
        icon: <CheckCircle size={24} />,
        color: 'from-orange-500 to-red-500',
        hoverColor: 'hover:border-orange-500',
      },
      {
        title: 'Vercel',
        desc: '프론트엔드 프로젝트 최적화 및 빠른 배포',
        url: 'https://vercel.com/',
        icon: <Globe size={24} />,
        color: 'from-slate-900 to-black',
        hoverColor: 'hover:border-slate-500',
      },
      {
        title: 'CodeSandbox',
        desc: '웹 기반 빠르고 강력한 코드 에디터',
        url: 'https://codesandbox.io/',
        icon: <Code size={24} />,
        color: 'from-sky-400 to-blue-500',
        hoverColor: 'hover:border-sky-500',
      },
      {
        title: 'Readme.so',
        desc: '간편하게 Github README 작성하는 에디터',
        url: 'https://readme.so/',
        icon: <PenTool size={24} />,
        color: 'from-teal-400 to-emerald-500',
        hoverColor: 'hover:border-teal-400',
      },
    ]
  },
  {
    title: '커뮤니티 및 블로그',
    description: '다른 개발자들과 소통하고 인사이트를 얻는 공간',
    items: [
      {
        title: 'Velog',
        desc: '국내 개발자들을 위한 기술 블로깅 플랫폼',
        url: 'https://velog.io/',
        icon: <MessageSquare size={24} />,
        color: 'from-teal-500 to-green-500',
        hoverColor: 'hover:border-teal-500',
      },
      {
        title: 'CSS-Tricks',
        desc: 'CSS에 관한 모든 팁과 트릭',
        url: 'https://css-tricks.com/',
        icon: <BookOpen size={24} />,
        color: 'from-orange-400 to-red-500',
        hoverColor: 'hover:border-orange-400',
      },
      {
        title: 'Frontend Mentor',
        desc: '실제 디자인 시안을 보고 구현하며 배우는 플랫폼',
        url: 'https://www.frontendmentor.io/',
        icon: <Code size={24} />,
        color: 'from-cyan-400 to-blue-500',
        hoverColor: 'hover:border-cyan-400',
      },
      {
        title: 'DEV.to',
        desc: '글로벌 기술 커뮤니티 및 아티클',
        url: 'https://dev.to/',
        icon: <Globe size={24} />,
        color: 'from-slate-800 to-black',
        hoverColor: 'hover:border-slate-500',
      },
      {
        title: 'Hashnode',
        desc: '개인 도메인을 지원하는 개발자 맞춤형 블로그',
        url: 'https://hashnode.com/',
        icon: <BookOpen size={24} />,
        color: 'from-blue-600 to-indigo-600',
        hoverColor: 'hover:border-blue-600',
      },
      {
        title: 'Tistory',
        desc: '국내 기술 블로그의 성지 방대한 자료들',
        url: 'https://www.tistory.com/',
        icon: <BookOpen size={24} />,
        color: 'from-orange-500 to-red-500',
        hoverColor: 'hover:border-orange-500',
      },
    ]
  },
  {
    title: '유튜브 학습 채널',
    description: '영상으로 쉽고 깊게 배우는 프론트엔드',
    items: [
      {
        title: '노마드 코더',
        desc: '풀스택 & 프론트엔드 클론 코딩 특화',
        url: 'https://www.youtube.com/@nomadcoders',
        icon: <Youtube size={24} />,
        color: 'from-yellow-400 to-orange-500',
        hoverColor: 'hover:border-yellow-400',
      },
      {
        title: '드림코딩',
        desc: '프론트엔드 기본기부터 실무까지 탄탄한 강의',
        url: 'https://www.youtube.com/@dream-coding',
        icon: <Youtube size={24} />,
        color: 'from-purple-500 to-indigo-500',
        hoverColor: 'hover:border-purple-500',
      },
      {
        title: '테오의 프론트엔드',
        desc: '프론트엔드 개발 팁과 성장 이야기',
        url: 'https://www.youtube.com/@teo.frontend',
        icon: <Youtube size={24} />,
        color: 'from-teal-400 to-emerald-500',
        hoverColor: 'hover:border-teal-400',
      },
      {
        title: '조코딩 JoCoding',
        desc: '웹 개발부터 AI까지 쉽고 재밌는 코딩',
        url: 'https://www.youtube.com/@jocoding',
        icon: <Youtube size={24} />,
        color: 'from-sky-400 to-blue-500',
        hoverColor: 'hover:border-sky-400',
      },
      {
        title: '얄팍한 코딩사전',
        desc: '개발 기초 지식을 쉽고 직관적으로 설명',
        url: 'https://www.youtube.com/@yalco-coding',
        icon: <Youtube size={24} />,
        color: 'from-orange-400 to-red-500',
        hoverColor: 'hover:border-orange-500',
      },
      {
        title: '1분코딩',
        desc: 'CSS 모션, Three.js 인터랙티브 웹 특화',
        url: 'https://www.youtube.com/@studiomeal',
        icon: <Youtube size={24} />,
        color: 'from-indigo-400 to-purple-500',
        hoverColor: 'hover:border-indigo-500',
      },
      {
        title: '코딩앙마',
        desc: 'JS, React 등 웹 개발 기초를 탄탄하게',
        url: 'https://www.youtube.com/@codingangma',
        icon: <Youtube size={24} />,
        color: 'from-red-400 to-rose-600',
        hoverColor: 'hover:border-red-500',
      },
      {
        title: '별코딩 Star Coding',
        desc: 'React Hooks와 핵심 개념 심층 분석',
        url: 'https://www.youtube.com/@starcoding',
        icon: <Youtube size={24} />,
        color: 'from-amber-400 to-yellow-500',
        hoverColor: 'hover:border-amber-400',
      },
      {
        title: 'Web Dev Simplified',
        desc: '(해외) 복잡한 개념을 가장 명쾌하게 설명',
        url: 'https://www.youtube.com/WebDevSimplified',
        icon: <Youtube size={24} />,
        color: 'from-blue-500 to-indigo-600',
        hoverColor: 'hover:border-blue-600',
      },
      {
        title: 'Fireship',
        desc: '(해외) 최신 개발 트렌드와 빠른 기술 리뷰',
        url: 'https://www.youtube.com/@Fireship',
        icon: <Youtube size={24} />,
        color: 'from-rose-500 to-pink-600',
        hoverColor: 'hover:border-rose-500',
      },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111] border-b border-slate-200 dark:border-white/5 py-16 sm:py-24 mb-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
            ✨ 즐겨찾기 필수
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            프론트엔드 <span className="gradient-text">개발자 리소스</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            프론트엔드 생태계를 항해하는 개발자를 위한 나침반. 
            <br className="hidden sm:block" />가장 검증된 공식 문서부터 유용한 도구, 튜토리얼 채널까지 한 곳에 모았습니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {RESOURCE_GROUPS.map((group, groupIdx) => (
          <section key={groupIdx} className="animate-fade-in" style={{ animationDelay: `${groupIdx * 100}ms` }}>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  {group.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {group.description}
                </p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10 ml-4 hidden md:block mb-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {group.items.map((item, itemIdx) => (
                <a
                  key={itemIdx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden flex flex-col p-6 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${item.hoverColor}`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-slate-400 dark:text-slate-500">
                    <ExternalLink size={18} />
                  </div>
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} text-white mb-5 shadow-lg shadow-black/5`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
