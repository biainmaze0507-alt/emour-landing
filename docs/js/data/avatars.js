/**
 * js/data/avatars.js
 * ---------------------------------------------------------------------------
 * 팀원 아바타 일러스트.
 *
 * 발표자료 "팀원 소개" 슬라이드의 아바타를 SVG 로 다시 그린 것이다.
 * 원 안에 어깨 · 머리 · 머리모양 · (안경) · 눈 · 입을 겹쳐 쌓는 구조이며,
 * 색은 CSS 변수 세 개만 받는다. 그래서 카드마다 다른 감정색이 그대로 스민다.
 *
 *   --av-bg    원 배경        (감정색을 아주 옅게)
 *   --av-face  얼굴 · 목      (거의 흰색)
 *   --av-dark  머리 · 어깨 · 선
 *
 * 사진을 쓰고 싶다면 js/data/team.js 의 avatar 에 이미지 경로를 넣으면 되고,
 * 그때는 이 일러스트 대신 사진이 들어간다.
 *
 * 좌표계는 80 × 80 이며 원(r=40) 밖으로 나간 부분은 잘려 나간다.
 */

/** 머리 위를 덮는 공통 캡 — 모든 머리모양이 이 위에서 시작한다. */
const CAP = "M21 35 A19 19 0 0 1 59 35 L59 31 C59 25 51 21 40 21 C29 21 21 25 21 31 Z";

/**
 * 머리모양 6종.
 * 각 값은 <path d="..."> 의 배열이며 --av-dark 로 채워진다.
 */
const HAIR = {
  /** 짧은 머리 */
  short: [CAP],

  /** 가르마 — 한쪽으로 넘긴 앞머리 */
  sidePart: [
    "M21 35 A19 19 0 0 1 59 35 L59 30 C59 24 51 20 40 20 C29 20 21 24 21 30 Z",
    "M36 21 C44 22 51 26 54 33 L49 34 C46 28 41 25 35 24 Z",
  ],

  /** 단발 — 귀 아래까지 내려오는 옆머리 */
  bob: [
    CAP,
    "M21 33 V48 C21 52 23 55 26 56 L28 53 C26 52 25 50 25 47 V33 Z",
    "M59 33 V48 C59 52 57 55 54 56 L52 53 C54 52 55 50 55 47 V33 Z",
  ],

  /** 앞머리 있는 단발 */
  bangs: [
    "M21 35 A19 19 0 0 1 59 35 L59 30 C52 33 45 34 40 34 C33 34 26 32 21 30 Z",
    "M21 33 V46 C21 50 23 53 26 54 L28 51 C26 50 25 48 25 45 V33 Z",
    "M59 33 V46 C59 50 57 53 54 54 L52 51 C54 50 55 48 55 45 V33 Z",
  ],

  /** 중간 길이 */
  medium: [
    CAP,
    "M21 33 V52 C21 56 22 59 24 61 L28 58 C26 56 25 54 25 51 V33 Z",
    "M59 33 V52 C59 56 58 59 56 61 L52 58 C54 56 55 54 55 51 V33 Z",
  ],

  /** 긴 머리 — 어깨를 덮고 내려온다 */
  long: [
    CAP,
    "M20 33 V62 C20 70 21 76 23 80 H30 C27 74 26 68 26 61 V33 Z",
    "M60 33 V62 C60 70 59 76 57 80 H50 C53 74 54 68 54 61 V33 Z",
  ],
};

/** 안경 — 발표자료의 둥근 렌즈 두 개 */
const GLASSES = `
  <circle cx="33.4" cy="34" r="5.4" fill="none" stroke="var(--av-dark)" stroke-width="1.5"/>
  <circle cx="46.6" cy="34" r="5.4" fill="none" stroke="var(--av-dark)" stroke-width="1.5"/>
  <path d="M38.8 33.6h2.4" stroke="var(--av-dark)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M28 32.6 24.4 31" stroke="var(--av-dark)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M52 32.6 55.6 31" stroke="var(--av-dark)" stroke-width="1.5" stroke-linecap="round"/>
`;

/**
 * 아바타 SVG 문자열을 만든다.
 *
 * @param {object} spec
 *   hair    HAIR 의 키 (기본 "short")
 *   glasses 안경 여부
 * @param {string} name  접근성 이름에 쓸 사람 이름
 * @returns {string} <svg>…</svg>
 */
export function avatarSvg({ hair = "short", glasses = false } = {}, name = "") {
  const hairPaths = (HAIR[hair] ?? HAIR.short)
    .map((d) => `<path d="${d}" fill="var(--av-dark)"/>`)
    .join("");

  // 안경을 쓰면 렌즈 안에 눈이 놓이고, 아니면 얼굴에 바로 놓인다
  const eyes = glasses
    ? `<circle cx="33.4" cy="34" r="1.5" fill="var(--av-dark)"/>
       <circle cx="46.6" cy="34" r="1.5" fill="var(--av-dark)"/>`
    : `<circle cx="34" cy="33.4" r="1.8" fill="var(--av-dark)"/>
       <circle cx="46" cy="33.4" r="1.8" fill="var(--av-dark)"/>`;

  const label = name ? `${name} 프로필 일러스트` : "프로필 일러스트";

  return `
    <svg viewBox="0 0 80 80" role="img" aria-label="${label}" focusable="false">
      <circle cx="40" cy="40" r="40" fill="var(--av-bg)"/>
      <rect x="35.5" y="43" width="9" height="13" rx="4" fill="var(--av-face)"/>
      <path d="M13 80 C13 63.5 25 54.5 40 54.5 C55 54.5 67 63.5 67 80 Z" fill="var(--av-dark)"/>
      <circle cx="40" cy="33" r="16" fill="var(--av-face)"/>
      ${hairPaths}
      ${glasses ? GLASSES : ""}
      ${eyes}
      <path d="M35.8 40.6 C37.4 42.4 42.6 42.4 44.2 40.6"
            fill="none" stroke="var(--av-dark)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `;
}
