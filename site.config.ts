/**
 * 이 파일 하나만 고치면 사이트 내용이 전부 바뀐다.
 *
 * 컴포넌트는 여기서 읽기만 한다 — 문구·링크·이미지를 컴포넌트 안에 직접 쓰지 않는다.
 * 그래야 다음 프로젝트가 "복사해서 내용만 바꾸기"로 끝난다.
 *
 * 채워야 할 곳은 전부 TODO(create-opensource) 로 표시해 뒀다.
 */

// ─────────────────────────────────────────────────────────────
// 정체성
// ─────────────────────────────────────────────────────────────
/**
 * 플레이스홀더는 GitHub 에 **실재하지 않는 이름**이어야 한다.
 * `your-org/your-repo` 는 실제로 존재해서, 채우기 전 미리보기에 남의 저장소
 * 별 개수가 그대로 떴다(실측). 채우기 전 상태는 배지가 비어 있는 게 맞다.
 */
export const repo = {
  owner: "woorichicken",
  name: "agent-swap",
  branch: "main",
} as const;

export const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

export const site = {
  /** 제품/프로젝트 이름. 헤더·OG·JSON-LD 에 그대로 쓴다. */
  name: "agent-swap",
  /** 한 줄. 검색 결과와 OG 설명의 첫 문장이 된다. */
  tagline: "Switch Claude Code accounts without logging out — and see Codex and Muse usage in the same place.",
  /** 두세 문장. meta description 으로 나간다(155자 안쪽 권장). */
  description:
    "MIT fork of claude-swap: switch Claude Code accounts without logging out, auto-switch before rate limits, and see Codex and Muse usage in one menu bar.",
  /** 배포 도메인. metadataBase·sitemap·canonical 의 기준. */
  url: "https://agent-swap-web.vercel.app",
  lang: "en",
  locale: "en_US",
  logo: "/logo.svg",
  /** OG 이미지(1200x630). 없으면 데모 이미지를 쓴다. */
  ogImage: "/og.png",
  license: "MIT",
  /** 검색 키워드. 과하게 넣지 않는다 — 5~12개. */
  keywords: ["claude code", "claude-swap", "account switcher", "rate limit", "codex", "muse", "macos menu bar", "cli", "open source"],
} as const;

// ─────────────────────────────────────────────────────────────
// 설치 — OSS 홈페이지에서 가장 많이 복사되는 한 줄
// ─────────────────────────────────────────────────────────────
export type InstallOption = { label: string; command: string };

export const install: {
  /** 히어로 바로 아래에 기본으로 뜨는 탭 */
  options: InstallOption[];
  /** 설치 뒤 확인용 한 줄(선택). 없으면 렌더 안 함. */
  verify?: string;
} = {
  options: [
    { label: "uv", command: "uv tool install git+https://github.com/woorichicken/agent-swap" },
    { label: "pipx", command: "pipx install git+https://github.com/woorichicken/agent-swap" },
    { label: "menu bar (macOS)", command: "uv tool install 'agent-swap[menubar] @ git+https://github.com/woorichicken/agent-swap'" },
  ],
  verify: "aswap list",
};

/** 30초 안에 뭔가 돌아가는 최소 예제. 히어로 다음에 온다. */
export const quickStart: { language: string; code: string } = {
  language: "bash",
  code: `# Log into Claude Code with your first account, then save it
cswap add

# Log in with another account (do not /logout first), save it too
cswap add

# Every account's 5-hour / 7-day usage, plus Codex and Muse
aswap list

# Switch, or let it switch for you before the limit
cswap switch
cswap auto --threshold 80`,
};

// ─────────────────────────────────────────────────────────────
// 히어로
// ─────────────────────────────────────────────────────────────
export const hero = {
  /** 로고 옆 작은 배지. 없애려면 null. */
  badge: { text: "MIT · fork of claude-swap" },
  /** 배열의 각 원소가 한 줄. 2줄이 가장 안정적이다. */
  title: ["Many coding agents,", "one place to watch the limits"],
  subtitle:
    "Keep several Claude Code accounts and switch between them without logging out. Codex and Muse usage sits next to them, in the terminal and in the macOS menu bar.",
  primaryCta: { label: "Get started", href: "#install" },
  secondaryCta: { label: "GitHub", href: repoUrl },
  /** 히어로 스크롤 애니메이션 안에 들어갈 데모. mp4 또는 이미지. */
  media: {
    type: "image" as "image" | "video",
    src: "/feature-list.png",
    alt: "aswap list: Claude accounts plus Codex and Muse usage",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// 기능 섹션 — 좌우 번갈아 배치된다
// ─────────────────────────────────────────────────────────────
export type Feature = {
  title: string;
  body: string;
  link?: { label: string; href: string };
  media: { type: "image" | "video"; src: string; alt: string };
};

export const featuresIntro = {
  badge: "Key Features",
  heading: "What it does",
  body: "It keeps claude-swap's accounts, data, and the cswap command, and adds the other agents you use.",
};

export const features: Feature[] = [
  {
    title: "Every account's limits at a glance",
    body: "The dashboard shows each Claude account's usage and reset times, with switch, add, and disable in the same menu. aswap list prints the same numbers plus Codex and Muse; a failed query says why instead of showing 0%.",
    link: { label: "Read the README →", href: `${repoUrl}#interactive-dashboard-tui` },
    media: { type: "image", src: "/hero.png", alt: "agent-swap terminal dashboard" },
  },
  {
    title: "Switches before you hit the limit",
    body: "cswap auto watches the active account and moves to the one with the most quota left once a window crosses your threshold. It takes the same credential locks Claude Code uses, so it is safe to run mid-session.",
    link: { label: "Automatic switching →", href: `${repoUrl}#automatic-switching` },
    media: { type: "image", src: "/feature-auto.png", alt: "cswap auto dry run" },
  },
];

// ─────────────────────────────────────────────────────────────
// FAQ — JSON-LD(FAQPage)로도 나가니 실제 질문만 쓴다
// ─────────────────────────────────────────────────────────────
export const faq: { question: string; answer: string }[] = [
  {
    question: "How is this different from claude-swap?",
    answer:
      "It is an MIT fork. Your existing claude-swap accounts, data, and the cswap command keep working. It adds the aswap command, read-only Codex and Muse usage, and a menu bar grouped by agent.",
  },
  {
    question: "Does it switch my Codex or Muse account?",
    answer:
      "No. Codex and Muse keep one login each. agent-swap only reads their usage and links to their own sign-in.",
  },
  {
    question: "Do I have to restart Claude Code after switching?",
    answer:
      "Usually not. Linux and Windows pick up the new account automatically, and macOS does once the Keychain cache expires. Restart Claude Code to apply it right away.",
  },
  {
    question: "What license is agent-swap under?",
    answer:
      "MIT, the same as claude-swap. You can use, modify, and redistribute it as long as you keep the copyright notice.",
  },
  {
    question: "How do I report a bug?",
    answer: `Open an issue at ${repoUrl}/issues with your OS, the command you ran, and its output (remove account emails first).`,
  },
];

// ─────────────────────────────────────────────────────────────
// 후원 — 결제 대신 들어가는 자리. 안 쓰면 enabled: false
// ─────────────────────────────────────────────────────────────
export const sponsor = {
  enabled: false,
  heading: "Support the project",
  body: "This project is maintained in the open. Sponsorship funds the time it takes.",
  cta: { label: "Sponsor on GitHub", href: `https://github.com/sponsors/${repo.owner}` },
};

// ─────────────────────────────────────────────────────────────
// 마지막 CTA
// ─────────────────────────────────────────────────────────────
export const cta = {
  heading: "Start in one command",
  body: "No signup. Your tokens stay on your machine. Read the source before you run it.",
};

// ─────────────────────────────────────────────────────────────
// 네비게이션 — 없는 페이지를 넣지 않는다(404 로 신뢰를 깎는다)
// ─────────────────────────────────────────────────────────────
export const nav: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Resources",
    items: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/roadmap", label: "Roadmap" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
];

export const footer = {
  columns: [
    {
      title: "Project",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Changelog", href: "/changelog" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: repoUrl },
        { label: "Issues", href: `${repoUrl}/issues` },
        { label: "Discussions", href: `${repoUrl}/discussions` },
        { label: "Feedback", href: "/feedback" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "License", href: `${repoUrl}/blob/${repo.branch}/LICENSE` },
        { label: "Upstream (claude-swap)", href: "https://github.com/realiti4/claude-swap" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// 사이트 검증 코드 — 없으면 비워 둔다(빈 값이 들어가면 태그를 안 만든다)
// ─────────────────────────────────────────────────────────────
export const verification: Record<string, string> = {
  // "naver-site-verification": "...",
  // "google-site-verification": "...",
};

// ─────────────────────────────────────────────────────────────
// /docs 페이지 — 진짜 문서가 따로 있으면 여기서 링크만 보낸다
// ─────────────────────────────────────────────────────────────
export const docs = {
  heading: "Documentation",
  body: "The README is the full manual. These are the sections people open first.",
  /** 외부 문서 사이트가 있으면 채운다. 없으면 null → 버튼을 그리지 않는다. */
  externalUrl: null as string | null,
  guides: [
    {
      title: "Installation",
      description: "uv, pipx, or from source — and replacing an existing claude-swap install.",
      href: `${repoUrl}#installation`,
    },
    {
      title: "Automatic switching",
      description: "Thresholds, strategies, and how it avoids flip-flopping.",
      href: `${repoUrl}#automatic-switching`,
    },
    {
      title: "Menu bar (macOS)",
      description: "Install the menubar extra and keep it running at login.",
      href: `${repoUrl}#menu-bar-macos`,
    },
    {
      title: "JSON output for scripting",
      description: "aswap list --json, including the otherAgents object for Codex and Muse.",
      href: `${repoUrl}#json-output-for-scripting`,
    },
  ],
}
