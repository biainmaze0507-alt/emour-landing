/**
 * js/data/identity.js
 * ---------------------------------------------------------------------------
 * BI / CI — 로고, 코어 팔레트, 접근성 근거, 타이포 스케일, 사용 규칙.
 * 값의 단일 출처는 frontend/src/styles/tokens.css 이며, 여기 HEX 는 그 복제다.
 * (팔레트 스와치와 대비 계산에 실제 숫자가 필요해서 복제해 둔다)
 */

/** 로고 두 색 → 화면 두 축 */
export const LOGO_PARTS = [
  {
    part: "워드마크 (글자)",
    hex: "#625955",
    role: "차분한 웜 그레이 — 안정감 · 신뢰 → 본문 텍스트 계열로 이어짐",
  },
  {
    part: "심볼 마크 (하트)",
    hex: "#CA8495",
    role: "말린 장미(dusty rose) — 애정 · 감정 → 브랜드 프라이머리 계열로 이어짐",
  },
];

/**
 * 코어 팔레트 8색.
 * ink 는 스와치 위에 얹는 글자색(밝은 면에는 어두운 글자).
 */
export const CORE_PALETTE = [
  {
    token: "--ci-bg-base",
    hex: "#FBFAF9",
    name: "Base",
    ink: "#352D2B",
    desc: "거의 흰색에 가까운 웜 화이트. 앱 전체 바탕이 되는 면입니다.",
  },
  {
    token: "--ci-bg-tint",
    hex: "#F5F0EF",
    name: "Tint",
    ink: "#352D2B",
    desc: "한 단계 가라앉은 면. 옅게 구분되어야 하는 블록에 씁니다.",
  },
  {
    token: "--ci-bg-deep",
    hex: "#E6DCDA",
    name: "Deep",
    ink: "#352D2B",
    desc: "배경 계열 중 가장 진한 값. 경계가 필요한 배경 요소에 씁니다.",
  },
  {
    token: "--ci-accent-soft",
    hex: "#F0C3CE",
    name: "Rose Soft",
    ink: "#352D2B",
    desc: "옅은 로즈. 강조면 · 테두리 · 점선 안내에 씁니다.",
  },
  {
    token: "--ci-accent",
    hex: "#D1748D",
    name: "Rose (Primary)",
    ink: "#FFFFFF",
    desc: "로고 하트에서 온 브랜드 색. 하이라이트 · 아이콘 · 활성 표시 담당입니다.",
  },
  {
    token: "--ci-ink-accent",
    hex: "#C14A67",
    name: "Ink Rose",
    ink: "#FFFFFF",
    desc: "텍스트로도 읽히는 진한 로즈. 흰 글씨를 얹는 채워진 버튼은 이 색만 씁니다.",
  },
  {
    token: "--ci-ink",
    hex: "#352D2B",
    name: "Ink",
    ink: "#FFFFFF",
    desc: "본문용 딥 웜 그레이. 배경 대비 12.90:1 로 AAA 등급입니다.",
  },
  {
    token: "--ci-white",
    hex: "#FFFFFF",
    name: "White",
    ink: "#352D2B",
    desc: "순백. 카드 표면과 색 면 위 반전 텍스트에 씁니다.",
  },
];

/**
 * 접근성 근거 — 로고 색과 UI 색이 왜 다른가.
 * 대비값은 js/modules/palette.js 가 WCAG 공식으로 직접 계산해서 채운다.
 */
export const CONTRAST_SAMPLES = [
  { hex: "#CA8495", caption: "원본 CI · 로고 심볼", text: "지금 시작하기" },
  { hex: "#D1748D", caption: "--color-primary", text: "지금 시작하기" },
  { hex: "#C14A67", caption: "--color-action", text: "지금 시작하기" },
];

/** 타이포 스케일 — 실제 크기로 렌더한다 */
export const TYPE_SCALE = [
  { token: "--font-display", size: 26, use: "화면 대표 제목" },
  { token: "--font-title", size: 20, use: "섹션 제목" },
  { token: "--font-heading", size: 17, use: "소제목" },
  { token: "--font-topbar-title", size: 16, use: "상단바 제목 (전 화면 통일)" },
  { token: "--font-body", size: 15, use: "본문" },
  { token: "--font-label", size: 13, use: "라벨" },
  { token: "--font-caption", size: 12, use: "캡션" },
  { token: "--font-micro", size: 11, use: "최소 크기 (시간 표기 등)" },
];

/** 사용 규칙 */
export const RULES = {
  do: [
    "HEX 를 직접 쓰지 않고 반드시 토큰(var(--color-*))을 경유합니다.",
    "흰 글씨 버튼은 --color-action(#C14A67)을 씁니다. --color-primary 는 대비가 부족합니다.",
    "틴트 면은 브랜드 로즈 하나로 통일하고, 위계는 색이 아니라 크기 · 여백으로 만듭니다.",
    "색 있는 면(.surface-feature)은 화면당 하나만 둡니다.",
    "감정 15색 · 기분 5색은 서버 열거형과 1:1 이므로 백엔드와 함께 변경합니다.",
  ],
  dont: [
    "블록마다 다른 색 틴트를 쓰는 것 — 화면이 산만해집니다.",
    "모든 블록을 흰 카드로 띄우는 것 — 위계가 사라집니다.",
    "갈색 계열 그림자를 넓게 까는 것 — 화면이 누렇게 탁해집니다.",
    "로고 색(#CA8495)을 UI 버튼 배경으로 쓰는 것 — 대비 2.90:1 로 기준 미달입니다.",
    "소셜 로그인 버튼 색을 CI 팔레트로 치환하는 것 — 각 사 브랜드 가이드 위반입니다.",
  ],
};
