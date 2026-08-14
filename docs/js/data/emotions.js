/**
 * js/data/emotions.js
 * ---------------------------------------------------------------------------
 * 감정 15종. 백엔드 chat.entity.EmotionType 열거형과 1:1이다.
 *
 * 원본 출처
 *   code           : 백엔드 EmotionType 열거형 이름
 *   label · group  : 감정 15종 스펙 — 표기와 4분류(긍정 · 중립 · 부정 · 관계 신호)
 *   token · hex    : frontend/src/styles/tokens.css (--emotion-*)
 *   icon           : lucide-react — 감정 15종 스펙 문서와 동일
 *
 * 화면에서 감정을 묶는 기준은 위의 4분류다.
 * 저장은 백엔드 EmotionPolarity 3종으로 하며,
 * 관계 신호는 고마움=긍정 · 미안함=중립 · 서운함=부정으로 들어간다.
 *
 * ⚠️ 감정을 늘리거나 줄이려면 백엔드 열거형과 함께 진행해야 한다.
 *    hex는 CSS 토큰과 같은 값을 복제해 둔 것이다(복사 배지·대비 계산에 필요).
 *    색을 바꿀 때는 css/base/00-tokens.css와 여기를 함께 고친다.
 */

export const EMOTION_GROUPS = {
  POSITIVE: { key: "POSITIVE", label: "긍정", token: "--group-positive" },
  NEUTRAL: { key: "NEUTRAL", label: "중립", token: "--group-neutral" },
  NEGATIVE: { key: "NEGATIVE", label: "부정", token: "--group-negative" },
  RELATION: { key: "RELATION", label: "관계 신호", token: "--group-relation" },
};

export const EMOTIONS = [
  // ── 긍정 3종 ─────────────────────────────────────────────────
  { code: "JOY",           label: "기쁨",     group: "POSITIVE", token: "--emotion-joy",           hex: "#F0B23F", icon: "smile" },
  { code: "EXCITEMENT",    label: "설렘",     group: "POSITIVE", token: "--emotion-excitement",    hex: "#EE7B9E", icon: "heartPulse" },
  { code: "COMFORT",       label: "편안",     group: "POSITIVE", token: "--emotion-comfort",       hex: "#64B98E", icon: "leaf" },

  // ── 중립 5종 ─────────────────────────────────────────────────
  { code: "WORRY",         label: "걱정",     group: "NEUTRAL",  token: "--emotion-worry",         hex: "#8397BD", icon: "cloudDrizzle" },
  { code: "SURPRISE",      label: "놀람",     group: "NEUTRAL",  token: "--emotion-surprise",      hex: "#56B6D6", icon: "zap" },
  { code: "NEUTRAL",       label: "평범",     group: "NEUTRAL",  token: "--emotion-plain",         hex: "#A29A96", icon: "meh" },
  { code: "SHYNESS",       label: "부끄러움", group: "NEUTRAL",  token: "--emotion-shyness",       hex: "#D98FA8", icon: "waves" },
  { code: "CURIOSITY",     label: "궁금",     group: "NEUTRAL",  token: "--emotion-curiosity",     hex: "#4FB3BF", icon: "circleHelp" },

  // ── 부정 4종 ─────────────────────────────────────────────────
  { code: "SADNESS",       label: "슬픔",     group: "NEGATIVE", token: "--emotion-sadness",       hex: "#5F86C4", icon: "cloudRain" },
  { code: "ANGER",         label: "화남",     group: "NEGATIVE", token: "--emotion-anger",         hex: "#DF6350", icon: "flame" },
  { code: "EMBARRASSMENT", label: "당황",     group: "NEGATIVE", token: "--emotion-embarrassment", hex: "#93819F", icon: "circleAlert" },
  { code: "DISTRESS",      label: "힘듦",     group: "NEGATIVE", token: "--emotion-distress",      hex: "#9A5A83", icon: "cloudLightning" },

  // ── 관계 신호 3종 — 상대를 향해 건네는 말에 붙는다 ───────────
  { code: "GRATITUDE",     label: "고마움",   group: "RELATION", token: "--emotion-gratitude",     hex: "#EF9A5B", icon: "handHeart" },
  { code: "APOLOGY",       label: "미안함",   group: "RELATION", token: "--emotion-apology",       hex: "#A396D2", icon: "heartHandshake" },
  { code: "HURT",          label: "서운함",   group: "RELATION", token: "--emotion-hurt",          hex: "#C04361", icon: "heartCrack" },
];

/** 코드로 감정 하나를 찾는다. 없으면 평범(NEUTRAL)으로 떨어진다. */
export function getEmotion(code) {
  return EMOTIONS.find((e) => e.code === code) ?? EMOTIONS.find((e) => e.code === "NEUTRAL");
}

/** 분류별 개수 — 필터 칩의 "긍정 3" 같은 표기에 쓴다. */
export function countByGroup(key) {
  return EMOTIONS.filter((e) => e.group === key).length;
}

/**
 * 오늘의 기분 5단계.
 * 감정 15색과는 별개인 척도다. (frontend/src/utils/moodEmotion.js)
 * 왼쪽(차갑고 가라앉음) → 오른쪽(따뜻하고 밝음) 순서로 배열한다.
 */
export const MOODS = [
  { step: 1, code: "VERY_SAD",   label: "매우 안 좋음", token: "--mood-very-sad",   hex: "#9587C7" },
  { step: 2, code: "SAD",        label: "안 좋음",      token: "--mood-sad",        hex: "#78B9DB" },
  { step: 3, code: "NEUTRAL",    label: "보통",         token: "--mood-neutral",    hex: "#9CC272" },
  { step: 4, code: "HAPPY",      label: "좋음",         token: "--mood-happy",      hex: "#F0CE5C" },
  { step: 5, code: "VERY_HAPPY", label: "매우 좋음",    token: "--mood-very-happy", hex: "#F2A968" },
];
