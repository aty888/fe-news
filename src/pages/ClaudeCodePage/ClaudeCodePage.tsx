// 클로드 코드 종합 가이드 페이지 — 소개·설치·명령어·단축키·토큰절약·프롬프트·고급워크플로우·Skill·최신뉴스
import { useState } from "react";
import {
  Terminal,
  Download,
  Keyboard,
  Zap,
  MessageSquare,
  Coins,
  BookOpen,
  GitBranch,
  Wand2,
  Newspaper,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Package,
  Settings,
  Code,
  Shield,
  Cpu,
  FileText,
  Heart,
  Clock,
  Star,
  Users,
  Globe,
  Layers,
  Lock,
  Play,
} from "lucide-react";
import { useClaudeNews } from "../../hooks/useClaudeNews";

const TABS = [
  { id: "intro", label: "소개", icon: Terminal },
  { id: "install", label: "설치", icon: Download },
  { id: "commands", label: "명령어", icon: Code },
  { id: "shortcuts", label: "단축키", icon: Keyboard },
  { id: "interaction", label: "인터랙션", icon: MessageSquare },
  { id: "tokens", label: "토큰 절약", icon: Coins },
  { id: "prompts", label: "프롬프트 작성법", icon: BookOpen },
  { id: "advanced", label: "고급 워크플로우", icon: GitBranch },
  { id: "skills", label: "Skill 만들기", icon: Wand2 },
  { id: "news", label: "최신 뉴스", icon: Newspaper },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SLASH_COMMANDS = [
  {
    cmd: "/help",
    desc: "사용 가능한 명령어 목록과 도움말 표시. 처음 시작할 때 필수.",
    category: "세션",
    example: "/help",
  },
  {
    cmd: "/clear",
    desc: "대화 기록 전체 초기화. 토큰 창을 리셋하고 새 작업을 시작할 때 사용.",
    category: "세션",
    example: "/clear",
  },
  {
    cmd: "/compact",
    desc: '대화를 요약·압축하여 토큰 절약. 지침 추가 가능: /compact "핵심 결정만 유지".',
    category: "세션",
    example: '/compact "완성된 기능과 미완성 작업만 유지"',
  },
  {
    cmd: "/init",
    desc: "현재 프로젝트를 분석해 CLAUDE.md 자동 생성. 기술 스택·디렉토리 구조 포함.",
    category: "설정",
    example: "/init",
  },
  {
    cmd: "/config",
    desc: "전역 또는 프로젝트 수준 설정 파일을 편집기로 열기.",
    category: "설정",
    example: "/config",
  },
  {
    cmd: "/model",
    desc: "현재 세션에서 사용할 Claude 모델 변경. 인수 없이 실행하면 선택 메뉴 표시.",
    category: "설정",
    example: "/model claude-sonnet-4-6",
  },
  {
    cmd: "/permissions",
    desc: "현재 세션에서 허용된 도구 목록 확인. allowedTools/deniedTools 설정 위치 안내.",
    category: "설정",
    example: "/permissions",
  },
  {
    cmd: "/doctor",
    desc: "Node 버전, API 키, 네트워크 연결 등 Claude Code 설치 상태를 종합 진단.",
    category: "진단",
    example: "/doctor",
  },
  {
    cmd: "/cost",
    desc: "현재 세션에서 소비한 토큰 수와 예상 비용을 달러로 표시.",
    category: "진단",
    example: "/cost",
  },
  {
    cmd: "/status",
    desc: "현재 에이전트 상태, 활성 MCP 서버, 로드된 스킬 목록 표시.",
    category: "진단",
    example: "/status",
  },
  {
    cmd: "/login",
    desc: "Anthropic 계정으로 인증. 처음 실행 시 브라우저가 열리며 OAuth 진행.",
    category: "인증",
    example: "/login",
  },
  {
    cmd: "/logout",
    desc: "현재 인증 정보를 삭제하고 세션 종료.",
    category: "인증",
    example: "/logout",
  },
  {
    cmd: "/mcp",
    desc: "연결된 MCP 서버 목록 확인, 재연결, 도구 검색.",
    category: "MCP",
    example: "/mcp",
  },
  {
    cmd: "/review",
    desc: "스테이징된 변경 사항 또는 현재 파일을 코드 리뷰. 개선 사항 제안.",
    category: "도구",
    example: "/review",
  },
  {
    cmd: "/memory",
    desc: "현재 프로젝트 메모리 파일 내용 확인 및 편집.",
    category: "도구",
    example: "/memory",
  },
  {
    cmd: "/bug",
    desc: "Claude Code 버그나 이상 동작을 Anthropic에 직접 리포트.",
    category: "도구",
    example: "/bug",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  세션: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  설정: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  진단: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  인증: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  MCP: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  도구: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

const CLI_FLAGS = [
  {
    flag: "--model <name>",
    short: "-m",
    desc: "실행할 Claude 모델 지정. 기본값은 Sonnet.",
    example: "claude --model claude-opus-4-7",
  },
  {
    flag: "--print",
    short: "-p",
    desc: "비대화식(headless) 모드로 응답만 출력. CI/CD에서 활용.",
    example: 'claude -p "코드 리뷰해줘"',
  },
  {
    flag: "--continue",
    short: "-c",
    desc: "가장 최근 대화를 이어서 계속 진행.",
    example: "claude --continue",
  },
  {
    flag: "--resume <session-id>",
    short: "",
    desc: "특정 세션 ID로 이전 대화를 복원.",
    example: "claude --resume abc123",
  },
  {
    flag: "--output-format <fmt>",
    short: "",
    desc: "text / json / stream-json 중 선택. --print와 함께 사용.",
    example: 'claude -p "분석" --output-format json',
  },
  {
    flag: "--max-turns <n>",
    short: "",
    desc: "에이전트 루프 최대 반복 횟수 제한.",
    example: "claude --max-turns 10",
  },
  {
    flag: "--system-prompt <prompt>",
    short: "",
    desc: "기본 시스템 프롬프트를 완전히 교체.",
    example: 'claude --system-prompt "당신은 코드 리뷰어입니다"',
  },
  {
    flag: "--append-system-prompt <p>",
    short: "",
    desc: "기존 시스템 프롬프트에 내용 추가.",
    example: 'claude --append-system-prompt "한국어로 답하세요"',
  },
  {
    flag: "--allowedTools <tools>",
    short: "",
    desc: "허용할 도구 목록을 콤마로 지정.",
    example: 'claude --allowedTools "Bash,Read"',
  },
  {
    flag: "--debug",
    short: "",
    desc: "디버그 정보 출력. hooks 동작 확인 시 유용.",
    example: "claude --debug",
  },
];

const SHORTCUTS = [
  {
    key: "Shift + Tab",
    action: "Plan Mode 전환",
    desc: "파일 수정 없이 탐색·분석만 수행하는 모드로 전환. 복잡한 작업 전 필수.",
    tip: "구현 시작 전 항상 먼저 Plan Mode로 분석하세요.",
  },
  {
    key: "Esc",
    action: "작업 취소",
    desc: "진행 중인 도구 실행 또는 응답 생성을 즉시 중단.",
    tip: "Claude가 잘못된 방향으로 가면 주저 없이 누르세요.",
  },
  {
    key: "Ctrl + C",
    action: "강제 종료",
    desc: "에이전트 루프를 완전히 종료. 프로세스 자체를 중단.",
    tip: "Esc로 멈추지 않을 때 사용.",
  },
  {
    key: "↑ / ↓",
    action: "입력 히스토리",
    desc: "이전에 입력했던 메시지를 탐색. 반복 작업 시 재사용 가능.",
    tip: "비슷한 작업을 반복할 때 생산성을 높여줍니다.",
  },
  {
    key: "Enter",
    action: "메시지 전송",
    desc: "현재 입력창의 내용을 제출.",
    tip: "",
  },
  {
    key: "Shift + Enter",
    action: "줄바꿈",
    desc: "멀티라인 입력. 긴 요구사항이나 코드 스니펫 붙여넣기 시 활용.",
    tip: "코드 예시를 직접 붙여넣을 때 사용하세요.",
  },
  {
    key: "# (첫 글자)",
    action: "메모리 저장",
    desc: "입력한 내용을 프로젝트 메모리(memory.md)에 영구 저장.",
    tip: '"# 이 프로젝트는 Supabase를 사용한다" 등 컨텍스트 저장.',
  },
  {
    key: "! (첫 글자)",
    action: "Bash 직접 실행",
    desc: "Claude를 거치지 않고 쉘 명령을 즉시 실행하고 결과 확인.",
    tip: "!git status, !npm run build 등 빠른 확인에 활용.",
  },
  {
    key: "/ (첫 글자)",
    action: "슬래시 명령",
    desc: "내장 명령어 팔레트 열기. 탭으로 자동완성 가능.",
    tip: "",
  },
];

const TOKEN_STRATEGIES = [
  {
    tag: "필수",
    color: "bg-red-500",
    title: "/compact 주기적 실행",
    desc: '대화가 길어지면 /compact [지침]으로 압축. 최대 60~70% 절약 가능. "완성된 기능 목록, 현재 진행 중인 작업, 다음 할 일만 유지" 같이 명확한 지침을 추가하면 효과 극대화.',
    saving: "최대 70%",
  },
  {
    tag: "필수",
    color: "bg-red-500",
    title: "새 작업엔 반드시 새 세션",
    desc: "이전 대화 컨텍스트가 새 작업의 방향을 왜곡하고 토큰을 낭비함. 작업 단위가 바뀔 때마다 /clear 또는 새 창을 사용하는 습관이 비용을 크게 줄임.",
    saving: "30~50%",
  },
  {
    tag: "핵심",
    color: "bg-orange-500",
    title: "CLAUDE.md 60~150줄 유지",
    desc: "CLAUDE.md는 모든 요청마다 자동으로 컨텍스트에 포함됨. 300줄짜리 CLAUDE.md는 매 턴마다 300토큰을 낭비. 규칙을 간결하게 유지하고 불필요한 주석을 제거하라.",
    saving: "15~25%",
  },
  {
    tag: "핵심",
    color: "bg-orange-500",
    title: "파일 참조 범위 좁히기",
    desc: '"프로젝트 전체 파악해줘" 대신 "@src/hooks/useAuth.ts 이 파일만 보고 버그 찾아줘"처럼 범위를 최소화. 컨텍스트에 포함되는 코드량이 곧 비용.',
    saving: "20~40%",
  },
  {
    tag: "권장",
    color: "bg-blue-500",
    title: "--continue 플래그 활용",
    desc: "claude --continue로 이전 세션을 이어받아 재구성 비용 절약. 중단된 작업에 특히 유용. 컨텍스트를 다시 설명하는 메시지를 쓸 필요가 없어짐.",
    saving: "10~20%",
  },
  {
    tag: "권장",
    color: "bg-blue-500",
    title: "Plan Mode에서 탐색만",
    desc: "구현 전 Shift+Tab으로 Plan Mode 진입. 잘못된 방향으로 50줄 코딩 후 되돌리는 낭비를 사전에 방지. 분석 단계의 토큰은 구현 실패 비용보다 훨씬 저렴.",
    saving: "30~60%",
  },
  {
    tag: "고급",
    color: "bg-purple-500",
    title: "Headless 배치 모드",
    desc: 'claude --print "명령"으로 비대화식 실행. 반복 작업(일괄 리팩토링, 자동 리뷰 등)을 스크립트로 자동화하면 수동 대화 비용 제거.',
    saving: "50~80%",
  },
  {
    tag: "고급",
    color: "bg-purple-500",
    title: "HANDOFF.md 패턴",
    desc: '세션 종료 전 "지금까지 한 작업과 다음 할 일, 주요 결정 사항을 HANDOFF.md에 요약해줘" 요청. 다음 세션에서 컨텍스트 재구성 비용을 최소화.',
    saving: "20~35%",
  },
];

const MODEL_PRICING = [
  {
    model: "Claude Haiku 4.5",
    input: "$0.80",
    output: "$4",
    context: "200K",
    best: "빠른 작업, 코드 자동완성, 간단한 Q&A",
  },
  {
    model: "Claude Sonnet 4.6",
    input: "$3",
    output: "$15",
    context: "200K",
    best: "일반 개발 작업, 기본 설정 모델",
  },
  {
    model: "Claude Opus 4.7",
    input: "$15",
    output: "$75",
    context: "200K",
    best: "복잡한 아키텍처, 어려운 버그, 고품질 리뷰",
  },
];

const PROMPT_TIPS = [
  {
    emoji: "🎯",
    title: "결과물을 구체적으로 명시",
    bad: '"버튼 만들어줘"',
    good: '"primary 스타일 버튼 컴포넌트를 TypeScript로 만들어줘. onClick, disabled, loading 상태를 지원하고, lucide-react 아이콘을 왼쪽에 선택적으로 받아야 해. named export, Tailwind CSS 사용."',
    why: "모호한 요청은 Claude가 가정을 채워 넣어서 원하지 않는 결과가 나옴.",
  },
  {
    emoji: "📋",
    title: "제약 조건 명시",
    bad: '"이 함수 최적화해줘"',
    good: '"이 함수를 최적화해줘. useMemo 사용, 기존 TypeScript 타입 변경 금지, 100줄 이내 유지, 테스트 코드는 건드리지 마."',
    why: "제약이 없으면 Claude가 전체 구조를 바꾸거나 불필요한 추상화를 추가함.",
  },
  {
    emoji: "🚫",
    title: "원하지 않는 것 명시",
    bad: '"로그인 페이지 만들어줘"',
    good: '"로그인 페이지 만들어줘. class 컴포넌트 금지, inline style 금지, 새 라이브러리 설치 금지, 자체 validation 로직 작성 금지 (zod 사용)."',
    why: 'Claude는 기본적으로 "AI slop" 패턴(class comp, inline style 등)으로 돌아오는 경향이 있음.',
  },
  {
    emoji: "✅",
    title: "검증 방법 포함",
    bad: '"이 버그 고쳐줘"',
    good: '"이 버그 고쳐줘. 수정 후 npm test가 통과해야 하고, 콘솔 에러가 없어야 해. 수정 내용을 1~3줄로 설명해줘."',
    why: "성공 기준이 명확해야 Claude가 작업 완료를 판단하고 불필요한 추가 작업을 막을 수 있음.",
  },
  {
    emoji: "🔢",
    title: "단계별로 분할",
    bad: '"전체 인증 시스템 구현해줘"',
    good: '"1단계: useAuth 훅만 먼저 구현해줘 (login/logout/getUser). 완성되면 내가 확인 후 다음 단계 요청할게."',
    why: "큰 작업을 한 번에 요청하면 중간에 방향이 틀리거나 컨텍스트 창이 낭비됨.",
  },
  {
    emoji: "📁",
    title: "참조 파일 명시",
    bad: '"기존 스타일과 맞춰줘"',
    good: '"@src/components/ArticleCard.tsx 이 컴포넌트의 스타일 패턴(카드 레이아웃, hover 효과, dark mode)을 정확히 따라서 NewsCard 컴포넌트 만들어줘."',
    why: '"기존 스타일"은 Claude가 전체 코드를 스캔해야 하므로 토큰 낭비. 파일을 직접 지정하라.',
  },
  {
    emoji: "🔄",
    title: "출력 형식 지정",
    bad: '"이 코드 설명해줘"',
    good: '"이 코드 설명해줘. 형식: 1) 한 줄 요약, 2) 핵심 로직 3단계, 3) 주의해야 할 엣지 케이스. 코드 블록 없이 텍스트만."',
    why: "형식을 지정하지 않으면 Claude가 과도한 설명이나 불필요한 코드를 추가함.",
  },
  {
    emoji: "🧪",
    title: "TDD 방식으로 요청",
    bad: '"useDebounce 훅 만들어줘"',
    good: '"useDebounce 훅을 TDD로 만들어줘. 먼저 실패하는 테스트 3개 작성 후, 테스트를 통과하는 최소 구현 코드 작성. Vitest + React Testing Library 사용."',
    why: "테스트 먼저 요청하면 구현의 경계가 명확해지고 Claude가 과잉 구현을 피함.",
  },
];

const FRONTEND_TEMPLATES = [
  {
    title: "React 컴포넌트 구현",
    code: `@src/components/ArticleCard.tsx 이 컴포넌트 참고해서
NewsletterSignup 컴포넌트 만들어줘.

요구사항:
- email input + 구독 버튼
- loading/success/error 상태 처리
- Supabase로 이메일 저장 (@src/lib/supabase.ts 사용)
- 기존 카드 스타일 그대로 적용
- named export, TypeScript strict

금지: class 컴포넌트, inline style, 새 패키지 설치`,
  },
  {
    title: "버그 수정 요청",
    code: `@src/hooks/useArticles.ts 이 훅에서
아래 에러가 발생하고 있어:

TypeError: Cannot read properties of undefined (reading 'map')
at useArticles.ts:34

에러 재현 조건: 북마크가 0개일 때
고쳐줘. 수정 후 npm test 통과해야 함.
타입 변경은 금지.`,
  },
  {
    title: "코드 리뷰 요청",
    code: `@src/pages/BoardPage/BoardFormPage.tsx 코드 리뷰해줘.

리뷰 기준:
1. TypeScript 타입 안전성 문제
2. React 안티패턴 (불필요한 re-render, useEffect 남용)
3. 접근성(a11y) 문제
4. 보안 취약점 (XSS, 입력 검증 누락)

형식: 문제점만, 각 항목에 파일:라인 번호 포함.
칭찬은 생략.`,
  },
  {
    title: "성능 최적화",
    code: `@src/pages/HomePage/HomePage.tsx
이 컴포넌트가 렌더링이 느린 것 같아.

분석해줘:
1. 불필요한 re-render 발생 위치
2. useMemo/useCallback으로 해결 가능한 부분
3. 이미지 최적화 필요 여부

분석 후 수정 시작 전에 계획 먼저 보여줘.
내가 OK하면 구현해줘.`,
  },
];

const HOOKS_CONFIG = `// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "bash .claude/hooks/safety-check.sh"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write \${CLAUDE_TOOL_INPUT_file_path} 2>/dev/null || true"
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "npm run type-check 2>&1 | head -20"
        }]
      }
    ],
    "SessionStart": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo Current branch: $(git branch --show-current)"
        }]
      }
    ]
  }
}`;

const SAFETY_HOOK = `#!/bin/bash
# .claude/hooks/safety-check.sh
# stdin으로 JSON 입력을 받아 위험한 명령을 차단

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# 금지 패턴 목록
BLOCKED_PATTERNS=(
  "rm -rf /"
  "git push.*--force.*main"
  "git push.*-f.*main"
  "DROP TABLE"
  "DELETE FROM.*WHERE.*1=1"
)

for pattern in "\${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "🚫 차단됨: 위험한 명령 패턴 감지 - $pattern" >&2
    exit 2  # exit 2 = 에이전트 루프 정지
  fi
done

exit 0  # 정상 진행`;

const MCP_CONFIG = `// ~/.claude/settings.json (전역 설정)
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": { "FIGMA_TOKEN": "your-figma-personal-token" }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "your-github-pat" }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
      }
    }
  }
}`;

const SKILL_EXAMPLES = [
  {
    name: "react-component",
    title: "React 컴포넌트 컨벤션",
    trigger: "/react-component",
    color: "from-blue-500 to-cyan-500",
    code: `---
name: react-component
description: "React TypeScript 컴포넌트 생성 팀 컨벤션"
---

컴포넌트를 만들 때 반드시 따를 규칙:

## 구조
- 파일 최상단에 한국어 주석으로 컴포넌트 역할 설명
- named export 사용 (default export 금지)
- Props 인터페이스를 \`ComponentNameProps\` 형태로 정의

## 스타일
- Tailwind CSS 유틸리티 클래스만 사용
- inline style 금지
- 반응형: 모바일 퍼스트 (base → sm → md → lg)

## 상태
- 비즈니스 로직은 useXxx 커스텀 훅으로 분리
- useState는 UI 상태만 (서버 데이터는 훅에서 관리)

## 접근성
- 버튼은 반드시 aria-label 또는 텍스트 포함
- 이미지는 alt 속성 필수`,
  },
  {
    name: "git-commit",
    title: "시맨틱 커밋",
    trigger: "/git-commit",
    color: "from-green-500 to-emerald-500",
    code: `---
name: git-commit
description: "시맨틱 커밋 메시지 생성 규칙"
---

커밋 메시지 작성 규칙:

## 타입 접두사
- feat: 새 기능
- fix: 버그 수정
- refactor: 동작 변경 없는 코드 개선
- style: 포맷팅, 세미콜론 등
- docs: 문서 변경
- test: 테스트 추가/수정
- chore: 빌드, 설정 변경

## 형식
\`type(scope): 설명\` — 한국어, 현재형 동사
예: feat(auth): 소셜 로그인 기능 추가

## 규칙
- 제목 50자 이내
- 본문은 "왜"를 설명 (선택)
- Breaking change는 BREAKING CHANGE: 명시`,
  },
  {
    name: "code-review",
    title: "코드 리뷰어",
    trigger: "/code-review",
    color: "from-orange-500 to-red-500",
    code: `---
name: code-review
description: "엄격한 프론트엔드 코드 리뷰 기준"
---

코드를 리뷰할 때 아래 기준으로 검토:

## 필수 확인 항목
1. TypeScript 타입 안전성 (any 사용, 타입 단언 남용)
2. React 안티패턴 (useEffect 의존성, 불필요한 re-render)
3. 보안 (dangerouslySetInnerHTML, 입력 검증 누락, XSS)
4. 접근성 (키보드 탐색, aria 속성, alt 텍스트)
5. 성능 (불필요한 API 호출, 큰 번들, 이미지 최적화)

## 출력 형식
각 문제는 다음 형식으로 출력:
\`[심각도: 높음/중간/낮음] 파일:라인 — 문제 설명 → 제안 수정\`

칭찬은 생략하고 개선점만 출력.`,
  },
];

const INSTALL_STEPS = [
  { title: "1. Node.js v18 이상 확인", code: "node --version\nnpm --version" },
  {
    title: "2. Claude Code 전역 설치",
    code: "npm install -g @anthropic-ai/claude-code\n\n# 설치 확인\nclaude --version",
  },
  {
    title: "3. 첫 실행 및 인증",
    code: "claude\n# 브라우저가 열리며 Anthropic 계정 OAuth 인증\n# 또는 API 키 직접 입력:\nexport ANTHROPIC_API_KEY=sk-ant-...",
  },
  {
    title: "4. 프로젝트 초기화",
    code: "cd your-project\nclaude /init\n# 프로젝트 분석 후 CLAUDE.md 자동 생성",
  },
];

const SETTINGS_TEMPLATE = `// .claude/settings.json (프로젝트 공유 설정)
{
  "model": "claude-sonnet-4-6",
  "allowedTools": [
    "Bash(npm run *)",
    "Bash(git *)",
    "Read",
    "Edit",
    "Write",
    "Glob",
    "Grep"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \${CLAUDE_TOOL_INPUT_file_path} 2>/dev/null || true"
      }]
    }]
  }
}`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group">
      <div className="flex gap-1.5 items-center px-4 py-2.5 rounded-t-xl bg-slate-800 dark:bg-black/80 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap rounded-b-xl bg-slate-900 dark:bg-black/60 text-slate-100">
        {code}
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="flex absolute top-2 right-2 gap-1 items-center px-2 py-1 text-xs rounded-md opacity-0 transition-all bg-white/10 hover:bg-white/20 text-slate-300 group-hover:opacity-100"
      >
        {copied ? <CheckCircle size={11} /> : "복사"}
      </button>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  text,
  color = "text-violet-500",
  sub,
}: {
  icon: React.ElementType;
  text: string;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-3 items-center mb-2">
        <div className="flex justify-center items-center w-9 h-9 bg-gradient-to-br rounded-xl border from-violet-500/20 to-violet-600/10 border-violet-500/20">
          <Icon size={18} className={color} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {text}
        </h2>
      </div>
      {sub && (
        <p className="ml-12 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {sub}
        </p>
      )}
    </div>
  );
}

function TipBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border shadow-sm border-amber-200/80 dark:from-amber-500/10 dark:to-orange-500/5 dark:border-amber-500/20">
      <p className="flex gap-2 items-center mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
        <span className="flex justify-center items-center w-5 h-5 rounded-full bg-amber-400/30">
          <Star size={11} className="text-amber-600 dark:text-amber-400" />
        </span>
        {title ?? "팁"}
      </p>
      <div className="space-y-1 text-sm leading-relaxed text-amber-800/80 dark:text-amber-300/90">
        {children}
      </div>
    </div>
  );
}

function AnalogyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border shadow-sm border-blue-200/80 dark:from-blue-500/10 dark:to-indigo-500/5 dark:border-blue-500/20">
      <p className="flex gap-2 items-center mb-3 text-sm font-semibold text-blue-800 dark:text-blue-300">
        <span className="flex justify-center items-center w-5 h-5 rounded-full bg-blue-400/30">
          <Layers size={11} className="text-blue-600 dark:text-blue-400" />
        </span>
        비유로 이해하기
      </p>
      <div className="text-sm leading-relaxed text-blue-800/80 dark:text-blue-300/90">
        {children}
      </div>
    </div>
  );
}

function WarningBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border shadow-sm border-red-200/80 dark:from-red-500/10 dark:to-rose-500/5 dark:border-red-500/20">
      <p className="flex gap-2 items-center mb-3 text-sm font-semibold text-red-800 dark:text-red-300">
        <span className="flex justify-center items-center w-5 h-5 rounded-full bg-red-400/30">
          <AlertTriangle size={11} className="text-red-600 dark:text-red-400" />
        </span>
        {title ?? "흔한 실수"}
      </p>
      <div className="space-y-1 text-sm leading-relaxed text-red-800/80 dark:text-red-300/90">
        {children}
      </div>
    </div>
  );
}

function IntroTab() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon={Terminal}
        text="Claude Code란?"
        sub="터미널에서 실행되는 AI 코딩 에이전트. 자연어 지시만으로 실제 코드를 읽고, 수정하고, 실행합니다."
      />

      <AnalogyBox>
        <p>
          처음 접하는 분들에게 이렇게 설명합니다.{" "}
          <strong>24시간 일하는 주니어 개발자를 채용했다고 생각하세요.</strong>{" "}
          타이핑이 빠르고 공식 문서는 다 읽었습니다. 단, 명확하게 지시하지
          않으면 자기 마음대로 합니다. "로그인 만들어줘"라고 하면 class
          컴포넌트로 만들어 옵니다. "TypeScript strict, Tailwind, named export,
          hooks 기반, 테스트 포함"처럼 구체적으로 말해야 원하는 결과가 나옵니다.
          Claude Code를 잘 쓰는 것의 80%는 바로 이{" "}
          <strong>명확한 지시를 내리는 기술</strong>입니다.
        </p>
      </AnalogyBox>

      <div>
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          ChatGPT나 Claude.ai랑 뭐가 다른가요?
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          가장 많이 받는 질문입니다. 결정적인 차이는{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            실제로 파일을 수정하고, 명령을 실행한다
          </strong>
          는 점입니다. ChatGPT는 코드를 채팅창에 보여줍니다. 여러분이 복사해서
          붙여넣어야 하죠. Claude Code는 파일을 직접 열어 수정하고, npm
          install도 직접 실행하고, git commit도 직접 합니다. AI가 키보드를 직접
          치는 것과 같습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            icon: Zap,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-500/10",
            title: "AI 코딩 에이전트",
            desc: '자연어 지시만으로 파일 읽기·수정·생성, 쉘 명령 실행, Git 조작, 웹 검색까지 수행합니다. "이 버그 잡아줘"라고 하면 원인을 찾고, 수정하고, 테스트까지 돌립니다. 단순 코드 생성이 아닌 실제 개발 작업을 수행하는 에이전트입니다.',
          },
          {
            icon: Shield,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-500/10",
            title: "완전 로컬 실행",
            desc: "코드가 Anthropic 외부 서버를 거치지 않고 로컬 머신에서 실행됩니다. API 호출만 외부로 나가고 실제 파일은 절대 전송되지 않습니다. 회사 내부 코드, 미출시 제품, API 키가 든 파일도 안전하게 작업 가능합니다.",
          },
          {
            icon: Settings,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            title: "완전한 커스터마이즈",
            desc: "CLAUDE.md로 프로젝트 규칙을 영구 저장하고, Hooks로 반복 작업을 자동화하고, Skills로 팀 컨벤션을 내재화합니다. 처음 설정이 번거롭지만 한 번 잡아두면 매번 설명하지 않아도 됩니다.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}
            >
              <item.icon size={20} className={item.color} />
            </div>
            <h3 className="mb-2 font-bold text-slate-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          실제로 할 수 있는 것들
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              icon: Code,
              text: "파일 읽기·수정·생성",
              sub: "Read, Edit, Write, Glob, Grep 도구",
            },
            {
              icon: Terminal,
              text: "쉘 명령 실행",
              sub: "npm run, git, docker 등",
            },
            {
              icon: GitBranch,
              text: "Git 워크플로우 전체",
              sub: "commit, branch, PR, bisect",
            },
            {
              icon: Globe,
              text: "웹 검색 및 URL 읽기",
              sub: "최신 문서, 이슈, 스택오버플로우",
            },
            {
              icon: Layers,
              text: "MCP 서버 연동",
              sub: "Figma, GitHub, Supabase, Linear",
            },
            {
              icon: Cpu,
              text: "멀티 에이전트 병렬 실행",
              sub: "Claude Agent SDK 활용",
            },
            {
              icon: Lock,
              text: "권한 기반 도구 제어",
              sub: "allowedTools로 세밀한 접근 제어",
            },
            {
              icon: Play,
              text: "CI/CD 파이프라인 통합",
              sub: "Headless 모드로 자동화",
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <div className="flex justify-center items-center w-8 h-8 bg-violet-50 rounded-lg dark:bg-violet-500/10 shrink-0">
                <item.icon size={15} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.text}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          일반 채팅 AI vs Claude Code
        </h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  기능
                </th>
                <th className="px-5 py-3 font-semibold text-center text-slate-700 dark:text-slate-300">
                  일반 채팅 AI
                </th>
                <th className="px-5 py-3 font-semibold text-center text-violet-600 dark:text-violet-400">
                  Claude Code
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {[
                ["실제 파일 수정", "✗ 코드만 보여줌", "✓ 직접 파일 편집"],
                ["명령 실행", "✗ 예시만 제공", "✓ npm, git 등 직접 실행"],
                [
                  "프로젝트 전체 파악",
                  "✗ 붙여넣은 코드만",
                  "✓ 전체 코드베이스 탐색",
                ],
                ["반복 작업 자동화", "✗ 매번 수동으로", "✓ Hooks로 자동화"],
                [
                  "팀 컨벤션 적용",
                  "✗ 매번 설명 필요",
                  "✓ CLAUDE.md에 영구 저장",
                ],
                ["외부 도구 연동", "✗ 불가", "✓ MCP 서버로 Figma, GitHub 등"],
              ].map(([feat, chat, code]) => (
                <tr key={feat} className="bg-white dark:bg-[#151515]">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {feat}
                  </td>
                  <td className="px-5 py-3 text-xs text-center text-slate-400">
                    {chat}
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-center text-green-600 dark:text-green-400">
                    {code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TipBox>
        <p>
          그동안 개발하면서 수많은 "생산성 도구"를 써봤습니다. 대부분 처음 한
          달만 쓰고 버렸습니다. Claude Code는 달랐습니다. 특히 세 가지에서 체감
          효과가 압도적입니다.{" "}
          <strong>
            반복적인 보일러플레이트 작성, 지루한 리팩토링, 처음 보는 레거시 코드
            파악.
          </strong>{" "}
          반면 복잡한 비즈니스 로직 설계나 성능 최적화처럼 도메인 지식이 필요한
          작업은 여전히 직접 해야 합니다. AI를 과신하지 마세요. 검토는 반드시
          사람이 합니다.
        </p>
      </TipBox>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { name: "터미널 CLI", sub: "macOS / Linux / Windows" },
          { name: "VS Code", sub: "Anthropic 확장 프로그램" },
          { name: "JetBrains", sub: "IntelliJ, WebStorm 등" },
          { name: "claude.ai", sub: "웹 브라우저 (beta)" },
        ].map((env) => (
          <div
            key={env.name}
            className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 text-center"
          >
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {env.name}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {env.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstallTab() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon={Download}
        text="설치 및 설정"
        color="text-green-500"
        sub="Node.js v18 이상이 필요합니다. Windows는 WSL2 환경을 권장합니다."
      />

      <AnalogyBox>
        <p>
          설치 자체는 5분이면 끝납니다. 그런데 대부분의 사람들이 설치만 하고{" "}
          <strong>settings.json 설정을 건너뜁니다.</strong> 이건 마치 새 직원을
          채용해놓고 온보딩을 생략하는 것과 같습니다. CLAUDE.md와
          settings.json을 제대로 설정해야 Claude Code가 "우리 팀 방식"으로
          일하기 시작합니다. 처음 30분을 투자하면 이후 매 세션마다 수십 분을
          아낍니다.
        </p>
      </AnalogyBox>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {INSTALL_STEPS.map((step) => (
          <div
            key={step.title}
            className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
          >
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {step.title}
            </p>
            <CodeBlock code={step.code} />
          </div>
        ))}
      </div>

      <WarningBox title="Windows 사용자 필독">
        <p>
          Windows에서 직접 PowerShell로 실행하면 bash 명령 호환성 문제가 자주
          발생합니다.{" "}
          <strong>
            WSL2(Windows Subsystem for Linux)를 설치하고 Ubuntu 터미널에서
            실행하는 것을 강력히 권장합니다.
          </strong>{" "}
          WSL2 설치는{" "}
          <code className="px-1 bg-red-100 rounded dark:bg-red-900/30">
            wsl --install
          </code>{" "}
          한 줄로 됩니다. VS Code에서 쓸 때는 WSL 확장 프로그램을 같이 설치하면
          완벽하게 통합됩니다.
        </p>
      </WarningBox>

      <div>
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          settings.json 기본 템플릿
        </h3>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          프로젝트 루트의{" "}
          <code className="text-xs bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
            .claude/settings.json
          </code>
          에 저장하면 팀 전체가 공유합니다.
          <strong className="text-slate-600 dark:text-slate-300">
            {" "}
            allowedTools 설정이 핵심입니다.
          </strong>{" "}
          여기서 허용한 명령만 Claude가 사전 승인 없이 실행할 수 있습니다.{" "}
          <code className="px-1 font-mono text-xs rounded bg-slate-100 dark:bg-white/10">
            Bash(npm run *)
          </code>
          처럼 패턴을 지정하면 npm run 으로 시작하는 명령은 모두 자동
          허용됩니다.
        </p>
        <CodeBlock code={SETTINGS_TEMPLATE} />
      </div>

      <TipBox title="CLAUDE.md가 가장 중요합니다">
        <p>
          <code className="px-1 bg-amber-100 rounded dark:bg-amber-900/30">
            claude /init
          </code>
          을 실행하면 Claude가 프로젝트를 분석해서 CLAUDE.md 초안을
          만들어줍니다. 여기에 기술 스택, 금지 패턴, 폴더 구조 설명을
          추가하세요. 이 파일은 모든 대화 시작 시 자동으로 컨텍스트에
          포함됩니다. 즉, 매번 "우리는 TypeScript strict 씁니다, Tailwind
          씁니다"를 설명할 필요가 없어집니다. 단, 너무 길면 매 요청마다 토큰
          낭비가 되니 60~150줄이 적정합니다.
        </p>
      </TipBox>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          설정 파일 계층 구조
        </h3>
        <div className="space-y-2">
          {[
            {
              file: "~/.claude/settings.json",
              scope: "전역",
              desc: "모든 프로젝트에 적용. 개인 선호도, 전역 MCP 서버.",
            },
            {
              file: ".claude/settings.json",
              scope: "프로젝트",
              desc: "팀 공유 설정. git에 커밋. 프로젝트 도구 권한, 훅.",
            },
            {
              file: ".claude/settings.local.json",
              scope: "개인",
              desc: ".gitignore에 추가. 개인 API 키, 로컬 오버라이드.",
            },
          ].map((item) => (
            <div
              key={item.file}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <span
                className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full text-white mt-0.5 ${item.scope === "전역" ? "bg-blue-500" : item.scope === "프로젝트" ? "bg-violet-500" : "bg-slate-500"}`}
              >
                {item.scope}
              </span>
              <div>
                <code className="font-mono text-xs text-violet-600 dark:text-violet-400">
                  {item.file}
                </code>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          첫 실행 체크리스트
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "claude /doctor로 설치 상태 확인",
            "claude /init으로 CLAUDE.md 생성",
            "CLAUDE.md에 기술 스택 명시",
            "allowedTools로 자주 쓰는 명령 허용",
            "hooks에 Prettier 자동 실행 설정",
            ".gitignore에 settings.local.json 추가",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <CheckCircle size={14} className="text-green-500 shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommandsTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showExample, setShowExample] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"slash" | "flags">(
    "slash",
  );
  const categories = [
    "전체",
    ...Array.from(new Set(SLASH_COMMANDS.map((c) => c.category))),
  ];
  const filtered = SLASH_COMMANDS.filter(
    (c) =>
      (activeCategory === "전체" || c.category === activeCategory) &&
      (c.cmd.includes(search) || c.desc.includes(search)),
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Code}
        text="명령어 레퍼런스"
        color="text-blue-500"
        sub="슬래시 명령어와 CLI 플래그를 모두 포함합니다."
      />

      <div className="flex gap-2">
        {[
          { id: "slash", label: "슬래시 명령어" },
          { id: "flags", label: "CLI 플래그" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as "slash" | "flags")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? "bg-blue-600 text-white" : "bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "slash" && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="명령어 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-400"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((cmd) => (
              <div
                key={cmd.cmd}
                className="rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setShowExample(showExample === cmd.cmd ? null : cmd.cmd)
                  }
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <code className="w-32 font-mono font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                    {cmd.cmd}
                  </code>
                  <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">
                    {cmd.desc}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cmd.category]} shrink-0`}
                  >
                    {cmd.category}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`text-slate-400 shrink-0 transition-transform ${showExample === cmd.cmd ? "rotate-90" : ""}`}
                  />
                </button>
                {showExample === cmd.cmd && (
                  <div className="px-5 pb-4 border-t border-slate-100 dark:border-white/5">
                    <p className="mt-3 mb-2 text-xs text-slate-400">
                      사용 예시
                    </p>
                    <code className="block px-3 py-2 font-mono text-xs text-green-600 bg-green-50 rounded-lg dark:text-green-400 dark:bg-green-500/10">
                      {cmd.example}
                    </code>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-slate-400">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        </>
      )}

      {activeSection === "flags" && (
        <div className="space-y-2">
          {CLI_FLAGS.map((flag) => (
            <div
              key={flag.flag}
              className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <div className="flex flex-wrap gap-3 items-start mb-2">
                <code className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                  {flag.flag}
                </code>
                {flag.short && (
                  <code className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                    {flag.short}
                  </code>
                )}
              </div>
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                {flag.desc}
              </p>
              <code className="block text-xs font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg">
                {flag.example}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShortcutsTab() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon={Keyboard}
        text="키보드 단축키"
        color="text-cyan-500"
        sub="Claude Code의 모든 입력 단축키와 활용 팁입니다."
      />

      <AnalogyBox>
        <p>
          <strong>
            Shift+Tab의 Plan Mode가 이 탭에서 가장 중요한 내용입니다.
          </strong>{" "}
          내비게이션에 비유하면, 목적지를 입력하고 경로를 확인한 다음 출발하는
          것과 같습니다. 복잡한 기능을 구현할 때 바로 "구현해줘"라고 하면
          Claude가 잘못된 방향으로 50줄을 코딩하고 나서야 문제가 드러납니다.
          Plan Mode에서 먼저 "어떤 파일을 건드릴 건지, 어떤 순서로 작업할
          건지"를 확인하세요. 수정 없이 탐색만 하기 때문에 실수가 없습니다.
          계획이 마음에 들면 일반 모드로 돌아와 "진행해줘"라고 하면 됩니다.
        </p>
      </AnalogyBox>

      <div className="space-y-3">
        {SHORTCUTS.map((s) => (
          <div
            key={s.key}
            className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
          >
            <div className="flex gap-4 items-start">
              <kbd className="shrink-0 px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold whitespace-nowrap min-w-[120px] text-center">
                {s.key}
              </kbd>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {s.action}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.desc}
                </p>
                {s.tip && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                    <Star size={10} className="shrink-0" /> {s.tip}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-amber-50 rounded-2xl border dark:bg-amber-500/10 border-amber-300/50 dark:border-amber-500/20">
        <p className="mb-3 font-semibold text-amber-800 dark:text-amber-300">
          상황별 단축키 활용 가이드
        </p>
        <div className="space-y-2">
          {[
            {
              situation: "복잡한 기능 구현 시작 전",
              action: "Shift+Tab → Plan Mode에서 분석 먼저",
            },
            {
              situation: "Claude가 엉뚱한 파일 수정 중",
              action: "Esc 즉시 누르고 방향 재지시",
            },
            {
              situation: "이전에 잘 된 프롬프트 재사용",
              action: "↑ 키로 히스토리 탐색",
            },
            {
              situation: "git 상태 빠르게 확인",
              action: "!git status 또는 !git diff",
            },
            {
              situation: "프로젝트 컨텍스트 영구 저장",
              action: "# 접두사로 메모리에 저장",
            },
          ].map((item) => (
            <div key={item.situation} className="flex gap-3 text-sm">
              <span className="text-amber-600 dark:text-amber-400 shrink-0">
                →
              </span>
              <div>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {item.situation}:
                </span>
                <span className="ml-1 text-slate-600 dark:text-slate-400">
                  {item.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractionTab() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon={MessageSquare}
        text="인터랙션 방식"
        color="text-pink-500"
        sub="Claude Code와 소통하는 다양한 방법과 도구 승인 흐름을 설명합니다."
      />

      <TipBox title="가장 많이 쓰게 될 기능: @파일 참조">
        <p>
          실무에서 가장 자주 쓰는 기능입니다.{" "}
          <strong>@src/components/Button.tsx처럼 파일을 직접 지정하면</strong>{" "}
          Claude가 그 파일만 읽고 작업합니다. "기존 스타일에 맞춰줘"라고 하면
          Claude가 전체 코드베이스를 스캔하면서 토큰을 낭비합니다. 참조 파일을
          명시할수록 비용이 줄고 정확도가 올라갑니다. 글로브 패턴{" "}
          <code className="px-1 bg-amber-100 rounded dark:bg-amber-900/30">
            @src/hooks/*.ts
          </code>
          도 지원됩니다.
        </p>
      </TipBox>

      <WarningBox title="도구 승인을 무조건 허용하지 마세요">
        <p>
          처음에는 Claude가 작업할 때마다 "이 명령을 실행해도 될까요?"를
          물어봅니다. "Always allow"를 누르면 편하지만,{" "}
          <strong>
            어떤 명령을 허용하는지 모르고 승인하는 것은 위험합니다.
          </strong>{" "}
          settings.json의 allowedTools에 허용할 명령 패턴을 명시적으로 정의하는
          방식이 더 안전합니다.{" "}
          <code className="px-1 bg-red-100 rounded dark:bg-red-900/30">
            Bash(git push *)
          </code>
          처럼 패턴을 좁게 잡을수록 실수를 방지할 수 있습니다.
        </p>
      </WarningBox>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "파일 직접 참조",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            desc: "@파일명으로 특정 파일을 컨텍스트에 포함. @src/hooks/*.ts처럼 글로브 패턴도 지원. 범위를 좁혀 토큰 절약과 정확도를 동시에 향상.",
            example: "@src/components/Button.tsx 이 컴포넌트의 a11y를 개선해줘",
          },
          {
            title: "이미지·스크린샷",
            icon: Package,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-500/10",
            desc: "터미널에 이미지를 붙여넣거나 파일 경로를 제공. Figma 스크린샷, 버그 화면, 와이어프레임을 직접 구현 요청 가능.",
            example: "design.png 이 레이아웃을 React+Tailwind로 구현해줘",
          },
          {
            title: "Bash 직접 실행",
            icon: Terminal,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-500/10",
            desc: "! 접두사로 Claude 없이 쉘 명령을 즉시 실행. 결과가 대화 컨텍스트에 자동으로 추가됨.",
            example: "!npm run build && !git status",
          },
          {
            title: "Plan Mode",
            icon: Cpu,
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            desc: "Shift+Tab으로 전환. 파일을 수정하지 않고 탐색·분석·계획만 수행. 복잡한 작업 전 반드시 사용.",
            example:
              'Plan Mode → "인증 버그 원인 파악해줘" → 계획 확인 → 일반 모드에서 구현',
          },
          {
            title: "멀티라인 입력",
            icon: MessageSquare,
            color: "text-cyan-500",
            bg: "bg-cyan-50 dark:bg-cyan-500/10",
            desc: "Shift+Enter로 줄바꿈. 복잡한 요구사항, JSON 설정, 코드 스니펫을 그대로 붙여넣어 요청 가능.",
            example:
              "여러 줄 요구사항과 JSON 예시를 그대로 붙여넣어 정확하게 전달",
          },
          {
            title: "권한 승인 흐름",
            icon: Shield,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-500/10",
            desc: '도구 실행 전 y/n 승인 요청. "Always allow"로 세션 내 영구 허용. settings.json allowedTools로 미리 허용 가능.',
            example: '"allowedTools": ["Bash(npm *)", "Read", "Edit"]',
          },
        ].map((mode) => (
          <div
            key={mode.title}
            className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
          >
            <div
              className={`w-9 h-9 rounded-lg ${mode.bg} flex items-center justify-center`}
            >
              <mode.icon size={18} className={mode.color} />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-slate-900 dark:text-white">
                {mode.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {mode.desc}
              </p>
            </div>
            <code className="px-3 py-2 mt-auto font-mono text-xs leading-relaxed rounded-lg text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5">
              {mode.example}
            </code>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          도구 승인 권한 모드
        </h3>
        <div className="space-y-3">
          {[
            {
              mode: "Default (Suggested)",
              color: "bg-yellow-500",
              desc: "각 도구 실행 전 사용자에게 승인 요청. 가장 안전하지만 상호작용이 많음.",
            },
            {
              mode: "Auto-approve (Plan Mode)",
              color: "bg-violet-500",
              desc: "Shift+Tab 활성화 시 파일 수정 없는 읽기 도구는 자동 승인. 수정 도구는 여전히 승인 필요.",
            },
            {
              mode: "allowedTools 사전 허용",
              color: "bg-green-500",
              desc: 'settings.json에 허용 목록을 미리 정의. "Bash(npm run *)"처럼 패턴 매칭도 지원.',
            },
            {
              mode: "deniedTools 블랙리스트",
              color: "bg-red-500",
              desc: "특정 도구를 아예 금지. Hooks의 PreToolUse와 조합하면 더욱 세밀한 제어 가능.",
            },
          ].map((item) => (
            <div
              key={item.mode}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <span
                className={`shrink-0 w-2 h-2 rounded-full ${item.color} mt-2`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.mode}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TokensTab() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon={Coins}
        text="토큰 절약 전략"
        color="text-yellow-500"
        sub="Claude Code 비용의 대부분은 컨텍스트 창 관리에서 결정됩니다."
      />

      <AnalogyBox>
        <p>
          <strong>
            토큰은 Claude와 나누는 대화의 "메모지"라고 생각하세요.
          </strong>{" "}
          Claude는 매 응답마다 지금까지의 대화 전체를 다시 읽습니다. 대화가
          10줄이면 10줄을, 1000줄이면 1000줄을 읽습니다. 그리고 읽는 분량만큼
          요금이 청구됩니다. CLAUDE.md도, 참조한 파일도, 이전 메시지도 모두
          포함됩니다. 그래서 대화가 길어질수록 같은 작업을 요청해도 비용이 계속
          늘어납니다.{" "}
          <strong>/compact 명령이 이 메모지를 요약해서 압축하는 역할</strong>을
          합니다. 주기적으로 실행하면 비용이 크게 줄어듭니다.
        </p>
      </AnalogyBox>

      <WarningBox title="비용을 모르고 쓰다가 폭탄 청구서 맞는 패턴">
        <p>
          처음 Claude Code를 쓸 때 가장 많이 저지르는 실수입니다. 하나의 대화
          세션에서 너무 많은 작업을 이어서 합니다. 아침에 시작한 세션을 저녁까지
          유지하면 컨텍스트 창이 엄청나게 커집니다.{" "}
          <code className="px-1 bg-red-100 rounded dark:bg-red-900/30">
            /cost
          </code>{" "}
          명령으로 현재 세션 누적 비용을 수시로 확인하고, 작업 단위가 바뀔
          때마다{" "}
          <code className="px-1 bg-red-100 rounded dark:bg-red-900/30">
            /clear
          </code>{" "}
          또는 새 창을 여세요.
        </p>
      </WarningBox>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          모델별 가격 비교 (1M 토큰 기준, 2025.05)
        </h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  모델
                </th>
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  입력 비용
                </th>
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  출력 비용
                </th>
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  컨텍스트
                </th>
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  권장 용도
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {MODEL_PRICING.map((m, i) => (
                <tr
                  key={m.model}
                  className={`bg-white dark:bg-[#151515] ${i === 1 ? "ring-1 ring-inset ring-violet-500/20" : ""}`}
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {m.model}
                    </p>
                    {i === 1 && (
                      <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                        기본 설정
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-700 dark:text-slate-300">
                    {m.input}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-700 dark:text-slate-300">
                    {m.output}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                    {m.context}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
                    {m.best}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TOKEN_STRATEGIES.map((s) => (
          <div
            key={s.title}
            className="flex items-start gap-3 p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
          >
            <span
              className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full text-white ${s.color}`}
            >
              {s.tag}
            </span>
            <div className="flex-1">
              <div className="flex gap-2 justify-between items-center mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 shrink-0">
                  {s.saving}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20">
        <p className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
          토큰 소비 패턴 이해하기
        </p>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>
            • CLAUDE.md + 대화 기록 + 참조 파일 ={" "}
            <strong>매 요청마다 컨텍스트로 포함됨</strong>
          </p>
          <p>• 긴 대화 = 높은 입력 토큰 (응답이 짧아도 비용 증가)</p>
          <p>
            • /compact 실행 시 대화 요약본만 유지 →{" "}
            <strong>입력 토큰 즉시 감소</strong>
          </p>
          <p>• /cost 명령으로 현재 세션 누적 비용 실시간 확인 가능</p>
        </div>
      </div>
    </div>
  );
}

function PromptsTab() {
  const [activeSection, setActiveSection] = useState<"tips" | "templates">(
    "tips",
  );
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={BookOpen}
        text="프롬프트 잘 쓰는 법"
        color="text-orange-500"
        sub="Claude Code에서 원하는 결과를 얻는 실전 기법입니다."
      />

      <AnalogyBox>
        <p>
          프롬프트 작성은{" "}
          <strong>새로 입사한 주니어에게 업무를 지시하는 것과 같습니다.</strong>{" "}
          "이 버튼 좀 고쳐봐"라고 하면 주니어는 자기 판단대로 고칩니다. 여러분이
          원하는 게 아닐 수 있습니다. "이 버튼의 hover 색상을 violet-600으로
          바꿔줘. className만 수정하고 기존 로직은 건드리지 마"라고 하면 정확히
          원하는 결과가 나옵니다.{" "}
          <strong>모호할수록 Claude는 가정을 채워 넣습니다.</strong>{" "}
          구체적일수록 정확합니다.
        </p>
      </AnalogyBox>

      <TipBox title="1분 투자로 30분 절약하는 비결">
        <p>
          프롬프트 작성에 1분을 더 투자하면 Claude의 잘못된 구현을 되돌리는
          30분을 아낍니다. 특히 <strong>원하지 않는 것을 명시하는 습관</strong>
          이 중요합니다. "class 컴포넌트 금지, inline style 금지, 새 패키지 설치
          금지"처럼 금지 조항을 넣으면 Claude가 "AI slop" 패턴으로 돌아오는 것을
          방지할 수 있습니다. 처음에는 번거롭지만 팀의 CLAUDE.md에 이 패턴을
          추가해두면 매번 입력할 필요도 없습니다.
        </p>
      </TipBox>

      <div className="flex gap-2">
        {[
          { id: "tips", label: "핵심 원칙" },
          { id: "templates", label: "프론트엔드 템플릿" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as "tips" | "templates")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? "bg-orange-500 text-white" : "bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "tips" && (
        <div className="space-y-4">
          {PROMPT_TIPS.map((tip) => (
            <div
              key={tip.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <h3 className="mb-1 font-bold text-slate-900 dark:text-white">
                <span className="mr-2">{tip.emoji}</span>
                {tip.title}
              </h3>
              <p className="mb-3 text-xs text-slate-400">{tip.why}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-1.5">
                    나쁜 예
                  </p>
                  <code className="block px-3 py-2 font-mono text-xs leading-relaxed bg-red-50 rounded-lg border border-red-200 text-slate-600 dark:text-slate-400 dark:bg-red-500/10 dark:border-red-500/20">
                    {tip.bad}
                  </code>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-500 mb-1.5">
                    좋은 예
                  </p>
                  <code className="block px-3 py-2 font-mono text-xs leading-relaxed bg-green-50 rounded-lg border border-green-200 text-slate-600 dark:text-slate-400 dark:bg-green-500/10 dark:border-green-500/20">
                    {tip.good}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === "templates" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            복사해서 바로 사용할 수 있는 실전 프롬프트 템플릿입니다.
          </p>
          {FRONTEND_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <p className="mb-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
                {tmpl.title}
              </p>
              <CodeBlock code={tmpl.code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdvancedTab() {
  const [activeSection, setActiveSection] = useState<
    "hooks" | "mcp" | "subagent" | "cicd"
  >("hooks");
  const sections = [
    { id: "hooks", label: "Hooks 자동화" },
    { id: "mcp", label: "MCP 서버" },
    { id: "subagent", label: "서브에이전트" },
    { id: "cicd", label: "CI/CD 통합" },
  ];

  const hookAnalogy = (
    <AnalogyBox>
      <p>
        <strong>Hooks는 공장 조립라인의 품질검사 단계와 같습니다.</strong>{" "}
        부품이 다음 단계로 넘어가기 전에 검사하고(PreToolUse), 작업이 끝나면
        마무리 처리를 하고(PostToolUse), 전체 라인이 멈출 때 최종 점검을
        합니다(Stop). Claude가 파일을 수정하기 직전에 Prettier를 자동
        실행하거나, 위험한 명령을 실행하려 할 때 자동으로 차단하는 것이
        가능합니다. 한 번 설정하면 매번 신경 쓸 필요가 없습니다.
      </p>
    </AnalogyBox>
  );

  const mcpAnalogy = (
    <AnalogyBox>
      <p>
        <strong>
          MCP(Model Context Protocol)는 Claude에게 특수 도구를 쥐어주는
          것입니다.
        </strong>{" "}
        기본 Claude는 파일과 터미널만 다룰 수 있습니다. Figma MCP를 연결하면
        Figma 파일을 직접 읽어 코드를 생성할 수 있고, GitHub MCP를 연결하면 PR
        생성과 코드 리뷰를 Claude에게 위임할 수 있습니다. 각 MCP 서버는 독립된
        프로세스로 실행되므로, 연결이 끊겨도 Claude 자체에는 영향이 없습니다.
      </p>
    </AnalogyBox>
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={GitBranch}
        text="고급 워크플로우"
        color="text-indigo-500"
        sub="Claude Code의 자동화, 외부 연동, 팀 협업 기능을 심화 학습합니다."
      />

      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? "bg-indigo-600 text-white" : "bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "hooks" && (
        <div className="space-y-6">
          {hookAnalogy}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                name: "PreToolUse",
                color: "bg-red-500",
                desc: "도구 실행 직전에 실행. exit code 2 반환 시 에이전트 루프 완전 정지. 위험한 명령(rm -rf, force push) 차단에 사용.",
              },
              {
                name: "PostToolUse",
                color: "bg-green-500",
                desc: "도구 실행 완료 후 실행. 파일 수정 시 Prettier/ESLint 자동 실행, 로그 기록 등에 활용.",
              },
              {
                name: "Stop",
                color: "bg-blue-500",
                desc: "Claude가 작업 완료를 선언할 때 실행. npm test 자동 실행 후 실패 시 계속 작업하도록 지시.",
              },
              {
                name: "SessionStart",
                color: "bg-violet-500",
                desc: "세션 시작 시 실행. 현재 git 브랜치, 미완성 PR 목록 등 컨텍스트를 자동 주입.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
              >
                <div className="flex gap-2 items-center mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${item.color}`}
                  >
                    {item.name}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              settings.json Hooks 설정 예시
            </p>
            <CodeBlock code={HOOKS_CONFIG} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              PreToolUse 안전 가드레일 스크립트
            </p>
            <CodeBlock code={SAFETY_HOOK} />
          </div>
        </div>
      )}

      {activeSection === "mcp" && (
        <div className="space-y-6">
          {mcpAnalogy}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                name: "Figma MCP",
                icon: "🎨",
                desc: "디자인 파일 읽어 코드 생성. 컴포넌트 구조, 색상, 타이포그래피를 그대로 반영한 React 컴포넌트 자동 생성.",
              },
              {
                name: "GitHub MCP",
                icon: "🐙",
                desc: "PR 생성·코멘트·리뷰, 이슈 생성·조회, 브랜치 관리를 자연어로 Claude에게 위임.",
              },
              {
                name: "Supabase MCP",
                icon: "⚡",
                desc: 'DB 스키마 조회, SQL 쿼리 실행, RLS 정책 확인을 자연어로. "사용자 테이블에 컬럼 추가해줘"가 가능.',
              },
              {
                name: "Linear MCP",
                icon: "📋",
                desc: "이슈 생성·업데이트·할당, 프로젝트 현황 조회를 Claude가 직접 수행.",
              },
              {
                name: "Slack MCP",
                icon: "💬",
                desc: "채널 메시지 전송, 스레드 조회를 Claude에게 위임. 배포 완료 알림 자동화 등에 활용.",
              },
              {
                name: "커스텀 MCP",
                icon: "🔧",
                desc: "내부 REST API를 MCP 서버로 래핑하면 Claude가 사내 시스템을 직접 제어 가능.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
              >
                <p className="mb-1 font-semibold text-slate-800 dark:text-slate-200">
                  {item.icon} {item.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              MCP 서버 설정 (settings.json)
            </p>
            <CodeBlock code={MCP_CONFIG} />
          </div>
        </div>
      )}

      {activeSection === "subagent" && (
        <div className="space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Claude Agent SDK를 사용하면 여러 에이전트를 역할에 따라 분리하거나
            병렬로 실행할 수 있습니다.
          </p>
          {[
            {
              title: "Reviewer 에이전트",
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-500/10",
              desc: "읽기 전용 권한(Read, Glob, Grep만 허용). 코드를 수정할 수 없어 리뷰 중 실수로 코드 변경하는 일이 없음.",
              code: "허용: Read, Glob, Grep, Bash(git diff)\n금지: Edit, Write, Bash(git commit)",
            },
            {
              title: "Builder 에이전트",
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-500/10",
              desc: "쓰기 권한을 가진 구현 전담 에이전트. Reviewer 에이전트의 리뷰 결과를 기반으로 구현.",
              code: '허용: 모든 도구\n시스템 프롬프트: "리뷰 결과를 반영해 구현하라"',
            },
            {
              title: "병렬 실행 패턴",
              color: "text-violet-500",
              bg: "bg-violet-50 dark:bg-violet-500/10",
              desc: "Claude Agent SDK에서 independant한 작업을 동시에 실행. 컴포넌트 A와 B를 동시 구현하는 등.",
              code: '# Agent SDK 예시\nawait Promise.all([\n  agent.run("컴포넌트 A 구현"),\n  agent.run("컴포넌트 B 구현"),\n])',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${item.bg} ${item.color} text-sm font-semibold mb-3`}
              >
                {item.title}
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
              <CodeBlock code={item.code} />
            </div>
          ))}
        </div>
      )}

      {activeSection === "cicd" && (
        <div className="space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Headless 모드로 CI/CD 파이프라인에 Claude를 통합합니다.
          </p>
          {[
            {
              title: "Headless 모드 기본",
              code: '# --print(-p)로 비대화식 실행\nclaude -p "이 PR의 보안 취약점을 JSON으로 출력해줘" \\\n  --output-format json \\\n  --max-turns 5\n\n# 파이프로 결과 처리\nclaude -p "에러 분석" | jq \'.result\'',
            },
            {
              title: "GitHub Actions 통합",
              code: `# .github/workflows/claude-review.yml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude 코드 리뷰
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npm install -g @anthropic-ai/claude-code
          git diff origin/main...HEAD > changes.diff
          claude -p "changes.diff를 리뷰하고 심각한 문제만 JSON으로 출력" \\
            --output-format json > review.json
          cat review.json`,
            },
            {
              title: "git bisect 자동화",
              code: '# Claude에게 버그 발생 커밋 찾기 위임\nclaude "이 버그를 재현하는 테스트를 먼저 작성하고,\ngit bisect로 버그가 처음 발생한 커밋을 찾아줘.\n테스트: npm test -- --testPathPattern=auth"',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5"
            >
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {item.title}
              </p>
              <CodeBlock code={item.code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillsTab() {
  const [activeSkill, setActiveSkill] = useState(0);
  return (
    <div className="space-y-8">
      <SectionTitle
        icon={Wand2}
        text="Claude Skill 만들기"
        color="text-pink-500"
        sub="Skill은 특정 작업에 Claude의 동작 방식을 정의하는 마크다운 파일입니다. /스킬명으로 즉시 활성화."
      />

      <AnalogyBox>
        <p>
          <strong>Skills는 새 팀원을 위한 업무 매뉴얼입니다.</strong> 신입이 올
          때마다 "우리 팀은 컴포넌트를 이렇게 만들어, 커밋 메시지는 이 형식으로
          써"라고 설명하는 대신 매뉴얼을 한 번 만들어두면 그 이후로는 읽기만
          하면 됩니다. Skill도 마찬가지입니다.{" "}
          <code className="px-1 bg-blue-100 rounded dark:bg-blue-900/30">
            /react-component
          </code>
          를 입력하면 Claude가 그 Skill 파일을 읽고 팀 컨벤션을 즉시 적용합니다.
          팀 전체가 같은 Skill을 쓰면, 사람마다 다른 코드 스타일 문제도
          자연스럽게 해결됩니다.
        </p>
      </AnalogyBox>

      <TipBox>
        <p>
          가장 먼저 만들어야 할 Skill은{" "}
          <strong>React 컴포넌트 컨벤션 Skill</strong>입니다. 팀에서 가장 자주
          반복하는 작업이고, Claude가 틀리는 빈도도 가장 높습니다. 한 번
          만들어두면 코드 리뷰에서 "왜 default export 썼어요?"라는 코멘트가
          사라집니다. 완성되면{" "}
          <code className="px-1 bg-amber-100 rounded dark:bg-amber-900/30">
            git add .claude/skills/
          </code>
          로 팀 전체에 배포하세요.
        </p>
      </TipBox>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          4단계로 만드는 첫 번째 Skill
        </h3>
        <div className="space-y-5">
          {[
            {
              step: "01",
              title: "디렉토리 생성",
              desc: "프로젝트 루트의 .claude/skills/ 폴더를 만드세요. 팀 공유 스킬은 git에 커밋하고, 개인 스킬은 settings.local.json에서 로드합니다.",
              code: "mkdir -p .claude/skills\n\n# 디렉토리 구조\n# .claude/\n#   settings.json       ← 팀 공유\n#   settings.local.json ← 개인 (.gitignore)\n#   skills/\n#     react-component.md\n#     git-commit.md",
            },
            {
              step: "02",
              title: "SKILL.md 작성",
              desc: "frontmatter에 메타데이터를 정의하고, 본문에 Claude가 따를 지침을 마크다운으로 작성합니다. 구체적일수록 효과적.",
              code: `---\nname: my-skill\ndescription: "컴포넌트 생성 시 팀 컨벤션 자동 적용"\n---\n\n# 컴포넌트 스킬\n\n반드시 따를 규칙:\n1. 파일 상단 한국어 주석\n2. named export (default 금지)\n3. Props를 ComponentNameProps로 정의\n4. Tailwind만 사용, inline style 금지`,
            },
            {
              step: "03",
              title: "트리거 방법",
              desc: "/스킬명으로 즉시 활성화하거나 settings.json에 추가해 세션 시작 시 자동 로드합니다.",
              code: '# 대화 중 수동 호출\n/my-skill\n\n# settings.json — 자동 로드\n{\n  "skills": [\n    ".claude/skills/react-component.md",\n    ".claude/skills/git-commit.md"\n  ]\n}',
            },
            {
              step: "04",
              title: "팀과 공유",
              desc: ".claude/skills/를 git에 커밋하면 팀 전체가 동일한 컨벤션을 사용합니다.",
              code: 'git add .claude/skills/\ngit commit -m "chore: add team Claude skills"\n\n# 개인 설정은 .gitignore에\necho ".claude/settings.local.json" >> .gitignore',
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-gradient-to-br from-pink-500 to-violet-600 rounded-full shrink-0">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="mb-1 font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h4>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
                <CodeBlock code={s.code} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          프론트엔드 Skill 템플릿 3종
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {SKILL_EXAMPLES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveSkill(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSkill === i ? `bg-gradient-to-r ${s.color} text-white` : "bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              .claude/skills/{SKILL_EXAMPLES[activeSkill].name}.md
            </p>
            <code className="font-mono text-xs text-violet-600 dark:text-violet-400">
              {SKILL_EXAMPLES[activeSkill].trigger}
            </code>
          </div>
          <CodeBlock code={SKILL_EXAMPLES[activeSkill].code} />
        </div>
      </div>
    </div>
  );
}

function NewsTab() {
  const { releases, articles, isLoading, error, refetch } = useClaudeNews();
  return (
    <div className="space-y-8">
      <div className="flex gap-4 justify-between items-start">
        <SectionTitle
          icon={Newspaper}
          text="최신 Claude 뉴스"
          color="text-teal-500"
          sub="GitHub 릴리즈와 Dev.to 아티클을 실시간으로 가져옵니다."
        />
        <button
          onClick={refetch}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-sm text-slate-600 dark:text-slate-400 hover:border-teal-400 transition-all disabled:opacity-50 shrink-0 mt-1"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />{" "}
          새로고침
        </button>
      </div>

      {isLoading && (
        <div className="flex gap-3 justify-center items-center py-16 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> 뉴스를 불러오는 중...
        </div>
      )}
      {error && (
        <div className="flex gap-3 items-start p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {!isLoading &&
        releases.length > 0 &&
        (() => {
          const r = releases[0];
          return (
            <div>
              <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-slate-900 dark:text-white">
                <Package size={18} className="text-teal-500" /> 최신 GitHub
                릴리즈
              </h3>
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:-translate-y-0.5 transition-all group"
              >
                <span
                  className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${r.prerelease ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300" : "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"}`}
                >
                  {r.tag_name}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 font-semibold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {r.name || r.tag_name}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                    {r.body
                      ?.split("\n")
                      .slice(0, 3)
                      .join(" ")
                      .replace(/[#*`]/g, "") || "변경사항 없음"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">
                    {new Date(r.published_at).toLocaleDateString("ko-KR")}
                  </p>
                  <ExternalLink
                    size={12}
                    className="mt-1 ml-auto text-slate-300 dark:text-slate-600"
                  />
                </div>
              </a>
            </div>
          );
        })()}

      {!isLoading && articles.length > 0 && (
        <div>
          <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-slate-900 dark:text-white">
            <FileText size={18} className="text-violet-500" /> Dev.to 아티클
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 hover:border-violet-400 dark:hover:border-violet-500 hover:-translate-y-0.5 transition-all group"
              >
                <p className="font-semibold leading-snug transition-colors text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-2">
                  {a.title}
                </p>
                {a.description && (
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {a.description}
                  </p>
                )}
                <div className="flex gap-3 items-center pt-2 mt-auto text-xs border-t text-slate-400 border-slate-100 dark:border-white/5">
                  <span>{a.user.name}</span>
                  <span className="flex gap-1 items-center">
                    <Heart size={10} />
                    {a.public_reactions_count}
                  </span>
                  <span className="flex gap-1 items-center">
                    <Clock size={10} />
                    {a.reading_time_minutes}분
                  </span>
                  <ExternalLink size={10} className="ml-auto" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!isLoading &&
        releases.length === 0 &&
        articles.length === 0 &&
        !error && (
          <div className="py-12 text-center text-slate-400">
            <Newspaper size={32} className="mx-auto mb-3 opacity-30" />
            <p>새로고침 버튼을 눌러 최신 뉴스를 불러오세요.</p>
          </div>
        )}

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          공식 리소스
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Claude Code 공식 문서",
              url: "https://docs.anthropic.com/en/docs/claude-code/overview",
              desc: "Anthropic 공식 가이드",
            },
            {
              title: "Hooks 레퍼런스",
              url: "https://docs.anthropic.com/en/docs/claude-code/hooks",
              desc: "이벤트 훅 완전 가이드",
            },
            {
              title: "MCP 문서",
              url: "https://docs.anthropic.com/en/docs/claude-code/mcp",
              desc: "Model Context Protocol",
            },
            {
              title: "anthropics/claude-code",
              url: "https://github.com/anthropics/claude-code",
              desc: "공식 오픈소스 저장소",
            },
            {
              title: "Reddit r/ClaudeAI",
              url: "https://www.reddit.com/r/ClaudeAI/",
              desc: "커뮤니티 팁 & 경험 공유",
            },
            {
              title: "Dev.to #claudecode",
              url: "https://dev.to/t/claudecode",
              desc: "개발자 아티클 모음",
            },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:-translate-y-0.5 transition-all group"
            >
              <ExternalLink
                size={14}
                className="text-teal-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  {link.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {link.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
          공식 + 초고스타 저장소
        </h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Anthropic 공식 저장소와 커뮤니티가 선정한 최고 스타 저장소 모음입니다.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              title: "anthropics/claude-code",
              stars: "55,000 ⭐",
              url: "https://github.com/anthropics/claude-code",
              badge: "공식",
              badgeColor: "bg-violet-500",
              desc: "Claude Code 공식 오픈소스 저장소. 이슈 트래커와 릴리즈 노트를 여기서 확인하세요.",
            },
            {
              title: "anthropics/skills",
              stars: "37,500 ⭐",
              url: "https://github.com/anthropics/skills",
              badge: "공식",
              badgeColor: "bg-violet-500",
              desc: "공식 Agent Skills 저장소. frontend-design, web-artifacts-builder 등 프론트엔드 스킬 파일 포함.",
            },
            {
              title: "ruvnet/claude-flow",
              stars: "31,800 ⭐",
              url: "https://github.com/ruvnet/claude-flow",
              badge: "추천",
              badgeColor: "bg-blue-500",
              desc: "멀티 에이전트 오케스트레이션 플랫폼. wiki에 React/Next.js 전용 CLAUDE.md 가이드가 별도 정리되어 있습니다.",
            },
            {
              title: "VoltAgent/awesome-agent-skills",
              stars: "",
              url: "https://github.com/VoltAgent/awesome-agent-skills",
              badge: "큐레이션",
              badgeColor: "bg-green-500",
              desc: "Google, Microsoft 등 기업 공식 프론트엔드 스킬 파일 모음. Anthropic 공식 스킬도 포함.",
            },
            {
              title: "ComposioHQ/awesome-claude-plugins",
              stars: "",
              url: "https://github.com/ComposioHQ/awesome-claude-plugins",
              badge: "큐레이션",
              badgeColor: "bg-green-500",
              desc: "frontend-design, senior-frontend, frontend-developer 등 React/TypeScript 전용 플러그인 MD 정리.",
            },
            {
              title: "travisvn/awesome-claude-skills",
              stars: "",
              url: "https://github.com/travisvn/awesome-claude-skills",
              badge: "큐레이션",
              badgeColor: "bg-green-500",
              desc: "frontend-design, web-artifacts-builder, webapp-testing(Playwright) 스킬 포함.",
            },
            {
              title: "VoltAgent/awesome-claude-code-subagents",
              stars: "",
              url: "https://github.com/VoltAgent/awesome-claude-code-subagents",
              badge: "큐레이션",
              badgeColor: "bg-green-500",
              desc: "100개 이상 전문 서브에이전트. categories/01-core-development/frontend-developer.md에 React/Vue/Angular 프롬프트 수록.",
            },
            {
              title: "jqueryscript/awesome-claude-code",
              stars: "",
              url: "https://github.com/jqueryscript/awesome-claude-code",
              badge: "큐레이션",
              badgeColor: "bg-green-500",
              desc: "Claude Code 생태계 전체를 스타 기준으로 정리. 🔥(1k+) 🌟(500+) ✨(100+) 표시로 필터링이 쉽습니다.",
            },
          ].map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 hover:border-violet-400 dark:hover:border-violet-500 hover:-translate-y-0.5 transition-all group"
            >
              <ExternalLink
                size={14}
                className="mt-0.5 text-violet-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <p className="text-sm font-semibold truncate transition-colors text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    {repo.title}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full text-white ${repo.badgeColor}`}
                  >
                    {repo.badge}
                  </span>
                  {repo.stars && (
                    <span className="text-xs text-slate-400">{repo.stars}</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {repo.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          프론트엔드 특화 Skill MD 파일
        </h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  스킬 파일
                </th>
                <th className="px-5 py-3 font-semibold text-left text-slate-700 dark:text-slate-300">
                  주요 내용
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {[
                {
                  skill: "frontend-design",
                  desc: '"AI slop" 방지, React & Tailwind 디자인 가이드',
                },
                {
                  skill: "web-artifacts-builder",
                  desc: "React + shadcn/ui + Tailwind 아티팩트 빌더",
                },
                {
                  skill: "webapp-testing",
                  desc: "Playwright 기반 UI 자동화 테스트",
                },
                {
                  skill: "senior-frontend",
                  desc: "Next.js/TypeScript 패턴, 번들 분석, 접근성",
                },
                {
                  skill: "callstackincubator",
                  desc: "React Native 전용 스킬 (328 ⭐)",
                },
                {
                  skill: "web-quality-skills",
                  desc: "Lighthouse / Core Web Vitals 최적화 (250 ⭐)",
                },
              ].map((row) => (
                <tr key={row.skill} className="bg-white dark:bg-[#151515]">
                  <td className="px-5 py-3">
                    <code className="font-mono text-xs text-violet-600 dark:text-violet-400">
                      {row.skill}
                    </code>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          위 스킬 파일들은{" "}
          <code className="px-1 font-mono rounded bg-slate-100 dark:bg-white/10">
            .claude/skills/
          </code>{" "}
          디렉토리에 복사 후{" "}
          <code className="px-1 font-mono rounded bg-slate-100 dark:bg-white/10">
            /스킬명
          </code>
          으로 즉시 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default function ClaudeCodePage() {
  const [activeTab, setActiveTab] = useState<TabId>("intro");

  const renderContent = () => {
    switch (activeTab) {
      case "intro":
        return <IntroTab />;
      case "install":
        return <InstallTab />;
      case "commands":
        return <CommandsTab />;
      case "shortcuts":
        return <ShortcutsTab />;
      case "interaction":
        return <InteractionTab />;
      case "tokens":
        return <TokensTab />;
      case "prompts":
        return <PromptsTab />;
      case "advanced":
        return <AdvancedTab />;
      case "skills":
        return <SkillsTab />;
      case "news":
        return <NewsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0d0d0d] border-b border-slate-200 dark:border-white/5 py-14">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-violet-500/8 dark:bg-violet-500/12" />
          <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-teal-500/8 dark:bg-teal-500/12" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-3xl bg-indigo-500/5 dark:bg-indigo-500/8" />
        </div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-16 lg:items-center">
            {/* Left: text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-5 shadow-sm">
                <Terminal size={12} />
                <span>AI 코딩 에이전트 · Anthropic 공식</span>
              </div>

              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
                Claude Code
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500">
                  완전 가이드
                </span>
              </h1>

              <p className="mb-6 max-w-xl text-base leading-relaxed lg:text-lg text-slate-500 dark:text-slate-400">
                프론트엔드 개발자가 실전에서 쓰는 방식으로 정리했습니다.
                비전공자도 바로 쓸 수 있게, 전문가도 새로운 걸 발견할 수 있게.
              </p>

              <div className="flex flex-wrap gap-3 justify-center text-xs font-medium lg:justify-start">
                {[
                  { icon: Users, label: "프론트엔드 개발자 전용" },
                  { icon: Star, label: "2025.05 최신화" },
                  { icon: Heart, label: "실전 중심" },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/8"
                  >
                    <item.icon size={11} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: terminal mockup */}
            <div className="hidden lg:block shrink-0 w-[360px]">
              <div className="overflow-hidden rounded-2xl border shadow-2xl border-slate-200 dark:border-white/10 shadow-violet-500/10 dark:shadow-violet-500/20">
                <div className="flex gap-2 items-center px-4 py-3 border-b bg-slate-800 dark:bg-black/80 border-white/5">
                  <span className="w-3 h-3 rounded-full bg-red-500/90" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/90" />
                  <span className="w-3 h-3 rounded-full bg-green-500/90" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    claude
                  </span>
                </div>
                <div className="bg-slate-900 dark:bg-[#0a0a0a] p-5 font-mono text-xs leading-relaxed">
                  <p className="text-slate-500">$ claude</p>
                  <p className="mt-2 text-violet-400">
                    ✻ Welcome to Claude Code!
                  </p>
                  <p className="mt-3 text-slate-400">
                    <span className="text-green-400">You:</span> useAuth 훅에서
                    TypeError 발생함
                  </p>
                  <p className="mt-2 text-slate-300">
                    <span className="text-violet-400">Claude:</span> 분석 중...
                  </p>
                  <p className="text-slate-400 mt-1.5">
                    ● Read src/hooks/useAuth.ts
                  </p>
                  <p className="text-slate-400">● Bash: npm test useAuth</p>
                  <p className="mt-2 text-green-400">
                    ✓ 버그 수정 완료. 테스트 통과.
                  </p>
                  <span className="inline-block mt-1 w-2 h-4 bg-violet-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div
            className="flex overflow-x-auto gap-0.5 py-2"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-10 mx-auto max-w-7xl sm:px-6">
        {renderContent()}
      </div>
    </div>
  );
}
