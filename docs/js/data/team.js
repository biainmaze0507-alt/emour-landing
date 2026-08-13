/**
 * js/data/team.js
 * ---------------------------------------------------------------------------
 * 팀원 소개.
 *
 * 필드 설명
 *    name    이름
 *    roles   역할 배지 (배열, 1~2개 권장)
 *    tone    카드에 번지는 색 — css/00-tokens.css의 감정 토큰 중 하나
 *    avatar  아바타 일러스트 경로 (발표자료 팀원 소개 슬라이드 원본 SVG)
 *    blurb   한 줄 소개
 *    tags    담당한 작업
 */

export const TEAM = [
  {
    name: "신승민",
    roles: ["PM", "Backend"],
    tone: "--emotion-joy",
    avatar: "assets/team/shin-seungmin.svg",
    blurb: "요구사항 정의부터 일정 관리까지, 팀이 같은 목적지를 보게 만들었습니다.",
    tags: ["기획 · 요구사항 명세", "커플 · 회원 도메인", "API 설계"],
  },
  {
    name: "기하영",
    roles: ["Backend"],
    tone: "--emotion-comfort",
    avatar: "assets/team/gi-hayeong.svg",
    blurb: "실시간 채팅과 대시보드 집계를 맡아 데이터가 흐르는 길을 놓았습니다.",
    tags: ["WebSocket · STOMP", "Redis Pub/Sub", "대시보드 집계"],
  },
  {
    name: "최영우",
    roles: ["Backend", "AI"],
    tone: "--emotion-curiosity",
    avatar: "assets/team/choi-yeongu.svg",
    blurb: "감정 분석 서버와 백엔드를 잇고, 문맥을 포함한 분석 계약을 설계했습니다.",
    tags: ["AI 연동 계약", "감정 분석 파이프라인", "답장 추천"],
  },
  {
    name: "하수연",
    roles: ["Frontend"],
    tone: "--emotion-excitement",
    avatar: "assets/team/ha-suyeon.svg",
    blurb: "채팅 화면과 감정 표시를 구현해 분석 결과가 대화 속에 자연스럽게 놓이게 했습니다.",
    tags: ["채팅 UI", "감정 태그 · 리액션", "무한 스크롤 · 검색"],
  },
  {
    name: "황민희",
    roles: ["Frontend"],
    tone: "--emotion-apology",
    avatar: "assets/team/hwang-minhee.svg",
    blurb: "디자인 시스템과 대시보드를 맡아 화면 전체가 하나의 톤을 갖게 정리했습니다.",
    tags: ["디자인 토큰 · BI/CI", "대시보드 · 차트", "캘린더 · 앨범"],
  },
  {
    name: "윤선민",
    roles: ["AI", "Infra"],
    tone: "--emotion-surprise",
    avatar: "assets/team/yun-seonmin.svg",
    blurb: "모델을 학습시키고 배포 파이프라인을 구성했습니다.",
    tags: ["KcELECTRA 파인튜닝", "데이터 재라벨링", "CI/CD · EC2 배포"],
  },
];

