/**
 * js/data/tech.js
 * ---------------------------------------------------------------------------
 * 시스템 아키텍처 · 기술 스택 · 프로젝트 규모.
 * 아키텍처 다이어그램은 이미지가 아니라 이 데이터로 그려진다(js/modules/architecture.js).
 *
 * tone은 노드 왼쪽 색 띠에 쓰는 CSS 토큰 이름이다.
 */

/** 규모 수치 — DOCS와 실제 저장소를 세어 넣은 값 */
export const SCALE_NUMBERS = [
  { value: 77, suffix: "", label: "REST 엔드포인트" },
  { value: 19, suffix: "", label: "데이터베이스 테이블" },
  { value: 15, suffix: "종", label: "감정 라벨 (백엔드 열거형)" },
  { value: 3, suffix: "", label: "서비스 컨테이너 (Web · API · AI)" },
];

/**
 * 아키텍처 레인.
 * flow는 레인과 레인 사이에 표시되는 화살표 문구다.
 */
export const ARCH_LANES = [
  {
    title: "CI / CD",
    nodes: [
      { name: "GitLab", role: "코드 Push · 병합 요청", tone: "--emotion-anger" },
      { name: "GitLab Runner", role: "파이프라인 실행", tone: "--emotion-anger" },
      { name: "Docker", role: "웹 · API · AI 이미지 빌드", tone: "--emotion-surprise" },
    ],
  },
  {
    flow: "자동 배포",
    title: "AWS EC2 · 실행 계층",
    nodes: [
      { name: "Nginx", role: "리버스 프록시 · 정적 파일 서빙", tone: "--emotion-comfort" },
      { name: "Certbot", role: "HTTPS 인증서 발급 · 자동 갱신", tone: "--emotion-comfort" },
    ],
  },
  {
    flow: "경로별 분기",
    title: "서비스 컨테이너",
    nodes: [
      { name: "React 19 + Vite", role: "최초 페이지 로드 · 모바일 웹 앱", path: "/", tone: "--emotion-surprise" },
      { name: "Spring Boot", role: "REST API · WebSocket(STOMP) · 인증", path: "/api  /ws", tone: "--emotion-comfort" },
      { name: "FastAPI", role: "감정 분석 · 답장 추천", path: "/ai", tone: "--emotion-curiosity" },
    ],
  },
  {
    flow: "저장 · 전달",
    title: "데이터 계층",
    nodes: [
      { name: "MySQL 8", role: "회원 · 커플방 · 채팅 · 분석 결과 영구 저장", tone: "--emotion-worry" },
      { name: "Redis", role: "Refresh 토큰 저장 · 채팅 이벤트 Pub/Sub", tone: "--emotion-anger" },
      { name: "Image Storage", role: "채팅 · 앨범 이미지 (EC2 볼륨)", tone: "--emotion-plain" },
    ],
  },
];

/** AI 학습 파이프라인 — 아키텍처 아래 별도 레인 */
export const AI_PIPELINE = {
  chain: ["beomi/KcELECTRA", "AI Hub 데이터셋", "문맥 포함 재라벨링", "PyTorch 파인튜닝"],
  model: "chlgks/emour-emotion-kcelectra-context-v2",
  /* 앞의 섹션 설명이 이미 학습 과정을 말하므로, 여기서는 겹치지 않는 한 줄만 둔다 */
  desc: "답장 추천은 이 모델이 아니라 프롬프트 기반 생성 모델이 맡습니다.",
};

/** 기술 스택 */
export const STACKS = [
  {
    title: "Frontend",
    tone: "--emotion-surprise",
    items: ["React 19", "Vite", "React Router", "STOMP", "SockJS", "lucide-react", "CSS Custom Properties"],
  },
  {
    title: "Backend",
    tone: "--emotion-comfort",
    items: ["Java 17", "Spring Boot", "Spring Security", "Spring Data JPA", "WebSocket", "Springdoc OpenAPI"],
  },
  {
    title: "AI",
    tone: "--emotion-curiosity",
    items: ["Python", "FastAPI", "PyTorch", "KcELECTRA", "Transformers", "Prompt 기반 생성"],
  },
  {
    title: "Data",
    tone: "--emotion-worry",
    items: ["MySQL 8", "Redis", "Spring Data JPA"],
  },
  {
    title: "Auth",
    tone: "--emotion-apology",
    items: ["JWT", "BCrypt", "Google OAuth 2.0", "이메일 인증"],
  },
  {
    title: "Infra",
    tone: "--emotion-anger",
    items: ["AWS EC2", "Docker Compose", "Nginx", "Certbot", "GitLab CI/CD"],
  },
];
