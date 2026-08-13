/**
 * js/data/site.js
 * ---------------------------------------------------------------------------
 * 사이트 전역 설정 — 내비게이션 목차, 외부 링크, 히어로 대화 시나리오.
 *
 * ✅ 여기부터 고치세요
 *    LINKS 의 값을 채우면 상단바 · 푸터 · 마무리 CTA 가 한꺼번에 살아납니다.
 *    빈 문자열("")로 두면 해당 버튼은 자동으로 "준비 중"(비활성)으로 렌더됩니다.
 */

export const LINKS = {
  /** 배포된 Emour 서비스 주소 (예: "https://emour.example.com") */
  service: "",
  /** 소스 저장소 */
  repository: "",
  /** 발표 자료 PDF */
  deck: "",
  /** 허깅페이스 모델 카드 */
  model: "https://huggingface.co/chlgks/emour-emotion-kcelectra-context-v2",
};

/** 상단바 · 모바일 시트 목차. id 는 <section> 의 id 와 같아야 한다. */
export const NAV_ITEMS = [
  { id: "why", label: "기획 배경" },
  { id: "features", label: "핵심 기능" },
  { id: "emotions", label: "감정 시스템" },
  { id: "film", label: "소개 영상" },
  { id: "proof", label: "유저 테스트" },
  { id: "tech", label: "아키텍처" },
  { id: "identity", label: "디자인" },
  { id: "team", label: "팀" },
];

/** 히어로 아래 요약 수치 */
export const HERO_FACTS = [
  { value: "15", suffix: "종", label: "감정 라벨 체계" },
  { value: "291", suffix: "명", label: "베타 테스트 참가자" },
  { value: "90.9", suffix: "%", label: "답장 추천 화행 일치율" },
  { value: "4.56", suffix: "/5", label: "채팅 기능 편리성" },
];

/**
 * 히어로 대화 시나리오.
 * heroChat.js 가 이 배열을 위에서부터 재생한다.
 *
 * type
 *   "mine"   내가 보낸 말풍선 (타이핑 연출 포함)
 *   "yours"  상대가 보낸 말풍선
 *   "wait"   잠깐 멈춤
 *   "suggest" 답장 추천 3안 노출
 *
 * emotion 에 감정 코드를 적으면 AI 분석 연출 뒤 그 감정 태그가 붙는다.
 */
export const HERO_SCRIPT = [
  { type: "yours", text: "이번 주말엔 혼자 쉬고 싶어", emotion: "DISTRESS" },
  { type: "mine", text: "그래도 우리 한 달 전부터 약속한 데이트잖아…", emotion: "SADNESS" },
  { type: "yours", text: "미안해 근데 이번 주는 진짜 안 될 것 같아", emotion: "APOLOGY" },
  { type: "wait", ms: 500 },
  {
    type: "suggest",
    items: [
      { kind: "해결형", text: "알겠어, 그럼 다음엔 언제 괜찮을지 알려줄래?" },
      { kind: "공감형", text: "많이 힘든가 보네, 괜찮아?" },
      { kind: "상냥하게", text: "그래, 네가 쉬고 싶으면 그렇게 해도 돼" },
    ],
  },
  { type: "wait", ms: 3400 },
];

/** 푸터 링크 묶음 */
export const FOOTER_GROUPS = [
  {
    title: "Product",
    items: [
      { label: "핵심 기능", href: "#features" },
      { label: "감정 시스템", href: "#emotions" },
      { label: "소개 영상", href: "#film" },
      { label: "유저 테스트", href: "#proof" },
    ],
  },
  {
    title: "Project",
    items: [
      { label: "시스템 아키텍처", href: "#tech" },
      { label: "디자인 시스템", href: "#identity" },
      { label: "팀 소개", href: "#team" },
      { label: "AI 모델 카드", href: LINKS.model, external: true },
    ],
  },
];

export const SITE = {
  name: "Emour",
  meaning: "Emotion + Amour",
  tagline: "커플 대화 기반 감정 분석 및 회고 서비스",
  closing: {
    lead: "받는 말에 <em>감정</em>을 담고, 보내는 말에 <em>정성</em>을 담아",
    sub: "서로의 마음이 올곧게 전해지도록",
  },
  team: "SSAFY 15기 공통 프로젝트 · B208",
  year: 2026,
};
