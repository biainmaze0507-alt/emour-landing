/**
 * js/data/emotions.js
 * ---------------------------------------------------------------------------
 * 감정 15종. 백엔드 chat.entity.EmotionType 열거형과 1:1이다.
 *
 * 원본 출처
 *   code · label · polarity : frontend/src/utils/emotions.js (EMOTION_TYPES)
 *   token · hex             : frontend/src/styles/tokens.css (--emotion-*)
 *   icon                    : lucide-react — 감정 15종 스펙 문서와 동일
 *
 * ⚠️ 감정을 늘리거나 줄이려면 백엔드 열거형과 함께 진행해야 한다.
 *    hex는 CSS 토큰과 같은 값을 복제해 둔 것이다(복사 배지·대비 계산에 필요).
 *    색을 바꿀 때는 css/00-tokens.css와 여기를 함께 고친다.
 */

export const POLARITY = {
  POSITIVE: { key: "POSITIVE", label: "긍정", token: "--emotion-positive" },
  NEUTRAL: { key: "NEUTRAL", label: "중립", token: "--emotion-neutral" },
  NEGATIVE: { key: "NEGATIVE", label: "부정", token: "--emotion-negative" },
};

export const EMOTIONS = [
  // ── POSITIVE 4종 ─────────────────────────────────────────────
  { code: "JOY",           label: "기쁨",     polarity: "POSITIVE", token: "--emotion-joy",           hex: "#F0B23F", icon: "smile" },
  { code: "EXCITEMENT",    label: "설렘",     polarity: "POSITIVE", token: "--emotion-excitement",    hex: "#EE7B9E", icon: "heartPulse" },
  { code: "COMFORT",       label: "편안함",   polarity: "POSITIVE", token: "--emotion-comfort",       hex: "#64B98E", icon: "leaf" },
  { code: "GRATITUDE",     label: "감사",     polarity: "POSITIVE", token: "--emotion-gratitude",     hex: "#EF9A5B", icon: "handHeart" },

  // ── NEUTRAL 6종 ──────────────────────────────────────────────
  { code: "WORRY",         label: "걱정",     polarity: "NEUTRAL",  token: "--emotion-worry",         hex: "#8397BD", icon: "cloudDrizzle" },
  { code: "SURPRISE",      label: "놀람",     polarity: "NEUTRAL",  token: "--emotion-surprise",      hex: "#56B6D6", icon: "zap" },
  { code: "NEUTRAL",       label: "평범",     polarity: "NEUTRAL",  token: "--emotion-plain",         hex: "#A29A96", icon: "meh" },
  { code: "SHYNESS",       label: "부끄러움", polarity: "NEUTRAL",  token: "--emotion-shyness",       hex: "#D98FA8", icon: "waves" },
  { code: "CURIOSITY",     label: "궁금함",   polarity: "NEUTRAL",  token: "--emotion-curiosity",     hex: "#4FB3BF", icon: "circleHelp" },
  { code: "APOLOGY",       label: "사과",     polarity: "NEUTRAL",  token: "--emotion-apology",       hex: "#A396D2", icon: "heartHandshake" },

  // ── NEGATIVE 5종 ─────────────────────────────────────────────
  { code: "SADNESS",       label: "슬픔",     polarity: "NEGATIVE", token: "--emotion-sadness",       hex: "#5F86C4", icon: "cloudRain" },
  { code: "ANGER",         label: "화남",     polarity: "NEGATIVE", token: "--emotion-anger",         hex: "#DF6350", icon: "flame" },
  { code: "EMBARRASSMENT", label: "당황",     polarity: "NEGATIVE", token: "--emotion-embarrassment", hex: "#93819F", icon: "circleAlert" },
  { code: "DISTRESS",      label: "괴로움",   polarity: "NEGATIVE", token: "--emotion-distress",      hex: "#9A5A83", icon: "cloudLightning" },
  { code: "HURT",          label: "상처",     polarity: "NEGATIVE", token: "--emotion-hurt",          hex: "#C04361", icon: "heartCrack" },
];

/** 코드로 감정 하나를 찾는다. 없으면 평범(NEUTRAL)으로 떨어진다. */
export function getEmotion(code) {
  return EMOTIONS.find((e) => e.code === code) ?? EMOTIONS[6];
}

/** 극성별 개수 — 필터 칩의 "긍정 4" 같은 표기에 쓴다. */
export function countByPolarity(key) {
  return EMOTIONS.filter((e) => e.polarity === key).length;
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
