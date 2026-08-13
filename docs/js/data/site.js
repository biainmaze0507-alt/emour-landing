/**
 * js/data/site.js
 * ---------------------------------------------------------------------------
 * 사이트 전역 설정 — 페이지 목차, 외부 링크, 히어로 대화 시나리오.
 *
 * ✅ 여기부터 고치세요
 *    LINKS의 값을 채우면 상단바 · 푸터 · 마무리 CTA가 한꺼번에 살아납니다.
 *    빈 문자열("")로 두면 해당 버튼은 자동으로 감춰집니다.
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

/**
 * 사이트 구조 — 페이지 5장과 각 페이지의 상세 목차.
 *
 * 상단바는 이 배열 하나로 만들어집니다.
 *   · 데스크톱 : 항목에 올리면 children이 드롭다운 패널로 펼쳐진다
 *   · 모바일   : 항목을 누르면 children이 아코디언으로 펼쳐진다
 *
 * 필드
 *   id       페이지 식별자. <body data-page="..."> 값과 같아야 한다
 *   label    상단바에 보이는 이름
 *   file     실제 파일명 (같은 폴더에 나란히 있으므로 상대경로 그대로)
 *   summary  드롭다운 패널 왼쪽에 붙는 한 줄 소개
 *   children 그 페이지 안의 섹션들. hash는 해당 <section> 의 id
 */
export const NAV = [
  {
    id: "home",
    label: "홈",
    file: "index.html",
    summary: "무엇을 만들었고 왜 만들었는지, 한 화면에서 훑어보는 자리.",
    children: [
      { hash: "why", label: "기획 배경", desc: "텍스트만 남으면 사라지는 것들" },
      { hash: "glance", label: "기능 요약", desc: "세 가지 일을 한눈에" },
      { hash: "film", label: "소개 영상", desc: "1분으로 보는 Emour" },
    ],
  },
  {
    id: "product",
    label: "제품",
    file: "product.html",
    summary: "대화가 오가는 동안 Emour가 하는 세 가지 일과, 그 바탕이 되는 감정 15종 체계.",
    children: [
      { hash: "features", label: "핵심 기능 3종", desc: "감정 분석 · 답장 추천 · 대시보드" },
      { hash: "emotions", label: "감정 15종 체계", desc: "서버 열거형과 1:1로 묶인 색과 아이콘" },
      { hash: "mood", label: "오늘의 기분 5단계", desc: "직접 기록하는 하루의 온도" },
    ],
  },
  {
    id: "proof",
    label: "검증",
    file: "proof.html",
    summary: "두 차례 베타 테스트에서 얻은 수치와, 그 피드백을 화면으로 되돌린 기록.",
    children: [
      { hash: "metrics", label: "핵심 수치", desc: "참가자 291명 · 설문 45명" },
      { hash: "speech", label: "화행 일치율", desc: "추천 문장이 의도한 말투로 나왔는가" },
      { hash: "f1", label: "Macro F1 여정", desc: "채점 기준을 계속 어렵게 바꿔 온 이야기" },
      { hash: "feedback", label: "피드백 반영", desc: "1차에서 들은 말 → 2차 화면" },
      { hash: "voices", label: "사용 후기", desc: "2차 테스트 참가자의 말" },
    ],
  },
  {
    id: "tech",
    label: "기술",
    file: "tech.html",
    summary: "컨테이너 세 개와 감정 분석 모델의 구조.",
    children: [
      { hash: "architecture", label: "시스템 아키텍처", desc: "Nginx가 경로로 나누는 세 컨테이너" },
      { hash: "model", label: "감정 분석 모델", desc: "KcELECTRA 파인튜닝 · 문맥 포함 학습" },
      { hash: "stacks", label: "기술 스택", desc: "프론트 · 백엔드 · AI · 인프라" },
    ],
  },
  {
    id: "brand",
    label: "브랜드",
    file: "brand.html",
    summary: "이름 하나에 담은 뜻과, 핑크 진주에서 가져온 색의 이야기.",
    children: [
      { hash: "naming", label: "이름의 뜻", desc: "Emotion과 Amour 사이에 남은 our" },
      { hash: "motif", label: "디자인 모티프", desc: "층층이 쌓여 완성되는 핑크 진주" },
      { hash: "palette", label: "컬러 아이덴티티", desc: "색마다 담긴 뜻" },
      { hash: "temperature", label: "색의 두 온도", desc: "정서의 색과 결심의 색" },
      { hash: "logo", label: "로고와 타이포", desc: "두 색이 화면의 두 축이 되는 방식" },
    ],
  },
  {
    id: "team",
    label: "팀",
    file: "team.html",
    summary: "여섯 사람이 나눈 역할과 함께 지킨 기준.",
    children: [
      { hash: "members", label: "팀원 소개", desc: "여섯 명이 나누어 맡은 자리" },
    ],
  },
];

/** 로고를 눌렀을 때 돌아가는 곳. 상단바 첫 항목("홈")과 같은 문서입니다. */
export const HOME_FILE = "index.html";

/** 히어로 아래 요약 수치 */
export const HERO_FACTS = [
  { value: "15", suffix: "종", label: "감정 라벨 체계" },
  { value: "291", suffix: "명", label: "베타 테스트 참가자" },
  { value: "66.7", suffix: "%", label: "감정 분석 절반 이상 일치 응답" },
  { value: "4.56", suffix: "/5", label: "채팅 기능 편리성" },
];

/**
 * 히어로 대화 시나리오.
 * heroChat.js가 이 배열을 위에서부터 재생한다.
 *
 * type
 *   "mine"    내가 보낸 말 — 입력창에 한 글자씩 쳐진 뒤 말풍선으로 올라간다
 *   "yours"   상대가 보낸 말 — 바로 말풍선으로 올라간다
 *   "suggest" 문장 다듬기 추천이 올라오는 시점
 *   "wait"    잠깐 멈춤 (ms)
 *
 * emotion에 감정 코드를 적으면 AI 분석 연출 뒤 그 감정 태그가 붙는다.
 * time은 앱의 formatTime() 표기(오후 h:mm)를 그대로 쓴다.
 */
export const HERO_SCRIPT = [
  { type: "yours", text: "이번 주말엔 혼자 쉬고 싶어", emotion: "DISTRESS", time: "오후 10:10" },
  { type: "wait", ms: 400 },
  { type: "mine", text: "그래도 우리 한 달 전부터 약속한 데이트잖아…", emotion: "SADNESS", time: "오후 10:10" },
  { type: "yours", text: "미안해 근데 이번 주는 진짜 안 될 것 같아", emotion: "APOLOGY", time: "오후 10:12" },
  { type: "suggest" },
  { type: "wait", ms: 1200 },
];

/**
 * 입력창 위 "문장 다듬기 추천" 칩.
 * 세 종류는 한 화면에 다 들어오지 않는다 — 가로로 넘겨 보는 자리다.
 */
export const HERO_SUGGESTS = [
  { kind: "해결형", text: "알겠어, 그럼 다음엔 언제 괜찮을지 알려줄래?" },
  { kind: "공감형", text: "많이 힘든가 보네, 괜찮아?" },
  { kind: "상냥하게", text: "그래, 네가 쉬고 싶으면 그렇게 해도 돼" },
];

export const SITE = {
  name: "Emour",
  meaning: "Emotion + Amour",
  tagline: "커플 대화 기반 감정 분석 및 회고 서비스",
  year: 2026,
};
