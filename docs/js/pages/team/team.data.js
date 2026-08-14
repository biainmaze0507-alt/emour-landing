/**
 * js/pages/team/team.data.js
 * ---------------------------------------------------------------------------
 * 팀원 소개.
 *
 * 필드 설명
 *    name    이름
 *    roles   역할 배지 (배열, 1~2개 권장)
 *    tone    카드에 번지는 색 — css/base/00-tokens.css의 감정 토큰 중 하나
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
    blurb: "요구사항 정의부터 일정 관리까지, 팀 전체의 방향성과 진행도를 관리하였습니다.",
    tags: ["기획 · 요구사항 명세 작성", "채팅 관련 API 설계 및 구현", "데이터 암호화 구현"],
  },
  {
    name: "기하영",
    roles: ["Backend"],
    tone: "--emotion-comfort",
    avatar: "assets/team/gi-hayeong.svg",
    blurb: "커플 연결과 대시보드 집계 기능을 주로 맡아 데이터의 흐름을 관리하였습니다.",
    tags: ["감정 정보 라벨링", "커플 연결 및 감정 집계 기능 구현", "대시보드 집계용 DB 설계 및 구현"],
  },
  {
    name: "최영우",
    roles: ["Backend", "AI"],
    tone: "--emotion-curiosity",
    avatar: "assets/team/choi-yeongu.svg",
    blurb: "회원·인증과 커플 앨범을 구현하고, 감정 분석 AI 모델을 직접 학습·고도화하며 ERD 설계를 주도했습니다.",
    tags: ["KcELECTRA 파인 튜닝", "데이터 크롤링", "ERD 설계"],
  },
  {
    name: "하수연",
    roles: ["Frontend"],
    tone: "--emotion-excitement",
    avatar: "assets/team/ha-suyeon.svg",
    blurb: "서비스 화면에 대한 목업을 설계하고 백엔드 API와의 전반적인 연결을 담당했습니다.",
    tags: ["목업 설계", "앨범 · 마이페이지 · 커플 연결 페이지 구현", "백엔드 API 연동"],
  },
  {
    name: "황민희",
    roles: ["Frontend"],
    tone: "--emotion-apology",
    avatar: "assets/team/hwang-minhee.svg",
    blurb: "전반적인 디자인 체계를 담당하여 화면 전체가 하나의 톤을 갖게 정리했습니다.",
    tags: ["BI/CI 및 디자인 토큰 설계", "발표용 영상 및 장표 제작", "로그인/회원가입 · 대시보드 · 채팅방 페이지 구현"],
  },
  {
    name: "윤선민",
    roles: ["AI", "Infra"],
    tone: "--emotion-gratitude",
    avatar: "assets/team/yun-seonmin.svg",
    blurb: "채팅 추천 AI를 설계, 구현하고 배포를 위한 인프라 파이프라인을 구성했습니다.",
    tags: ["채팅 추천 AI 설계 및 구현", "감정 카테고리 설계", "CI/CD · EC2 배포"],
  },
];

