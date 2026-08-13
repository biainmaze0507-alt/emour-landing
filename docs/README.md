# Emour 랜딩 페이지

커플 대화 기반 감정 분석 및 회고 서비스 **Emour** 의 소개 사이트입니다.

**빌드 도구가 전혀 없습니다.** 순수 HTML + CSS + ES Module 로만 만들어져 있어서,
이 폴더를 정적 호스팅에 그대로 올리면 바로 동작합니다. (npm install 없음, 번들러 없음)

> 이 문서는 **폴더 구조와 수정 방법**을 다룹니다.
> 배포 방법은 저장소 루트의 [`../README.md`](../README.md) 를 보세요.
>
> 로고 · 영상 등 자산은 Emour 본 저장소에서 **복사**해 온 것으로,
> 원본(`frontend/`, `backend/`, `AI/` …)은 전혀 건드리지 않았습니다.

---

## 1. 로컬에서 보기

`index.html` 을 **더블클릭해서 열면 안 됩니다.** `file://` 에서는 브라우저가 ES Module 을
CORS 정책으로 막기 때문에 상단바조차 그려지지 않습니다.

아무 간이 서버나 하나 띄우면 됩니다.

```bash
cd docs

python -m http.server 5500     # Python
npx serve .                    # Node
```

→ http://localhost:5500

VS Code 를 쓴다면 Live Server 확장 설치 후 `index.html` 우클릭 → *Open with Live Server*.

---

## 2. 페이지 구성

한 페이지에 전부 담지 않고 **5개 주제로 나눴습니다.** 스크롤이 끝없이 길어지면
읽는 사람이 지금 어디쯤인지 알 수 없고, 발표 중에 특정 부분만 보여 주기도 어렵기 때문입니다.
페이지마다 주소가 따로 있으니 “감정 15종만 보세요” 하고 링크를 줄 수 있습니다.

| 파일 | `data-page` | 담는 내용 |
| --- | --- | --- |
| `index.html` | `home` | 히어로(살아 있는 대화 창) · 기획 배경 · 기능 요약 3장 · 소개 영상 |
| `product.html` | `product` | 핵심 기능 3종(탭) · 감정 15종 체계 · 오늘의 기분 5단계 |
| `proof.html` | `proof` | 유저 테스트 수치 · 화행 일치율 · Macro F1 · 피드백 반영 · 후기 |
| `tech.html` | `tech` | 시스템 아키텍처 · 감정 분석 모델 · 기술 스택 |
| `brand.html` | `brand` | 이름의 뜻 · 핑크 진주 모티프 · 컬러 아이덴티티 · 웜톤/쿨톤 · 로고 · 타이포 |
| `team.html` | `team` | 팀원 6명 · 함께 일한 방식 |

`<body data-page="...">` 값이 **어떤 JS 모듈을 켤지** 정합니다 (`js/main.js` 의 `PAGE_MODULES`).
그래서 페이지를 늘리거나 섹션을 옮길 때 HTML 의 `<script>` 를 건드릴 필요가 없습니다.

### 상단바와 푸터는 HTML 에 없습니다

페이지가 5장이라 상단바 마크업을 파일마다 복사해 두면 목차를 한 번 고칠 때 5곳을 고쳐야 합니다.
그래서 HTML 에는 빈 껍데기만 두고,

```html
<header class="site-nav"></header>
<footer class="site-footer"></footer>
```

`js/modules/chrome.js` 가 `js/data/site.js` 의 `NAV` 하나로 상단바 · 드롭다운 · 모바일 시트 ·
푸터를 모두 만듭니다. **목차를 고칠 곳은 `js/data/site.js` 한 곳뿐입니다.**

---

## 3. 폴더 구조

```
docs/
├── index.html                 홈
├── product.html               제품
├── proof.html                 검증
├── tech.html                  기술
├── brand.html                 브랜드
├── team.html                  팀
├── .nojekyll                  GitHub Pages 용 표식
├── README.md                  이 문서
│
├── assets/
│   ├── logo-wordmark.svg      하트 + 글자가 함께 든 완성형 로고
│   ├── logo-mark.svg          하트 심볼 단독 (앱 아이콘 · 파비콘용)
│   ├── favicon.svg            파비콘
│   └── video/
│       └── emour-promo.mp4    소개 영상 (13MB · 재생 버튼을 눌러야 내려받음)
│
├── css/
│   ├── 00-tokens.css          ★ 색 · 타이포 · 간격 · 모션의 단일 출처
│   ├── 01-base.css            리셋 · 기본 타이포 · 공통 텍스트 유틸
│   ├── 02-layout.css          상단바 + 드롭다운 · 페이지 머리글 · 섹션 셸 · 푸터
│   ├── 03-motion.css          스크롤 등장 연출 · 반복 애니메이션
│   ├── 04-components.css      ★ 버튼 · 칩 · 대화 창 · 말풍선 · 추천 칩 · 리포트
│   └── sections/
│       ├── hero.css           홈 첫 화면
│       ├── why.css            기획 배경 (감정 단서 ON/OFF)
│       ├── features.css       기능 요약 3장 + 기능 탭 레이아웃
│       ├── emotions.css       감정 15종 · 기분 5단계
│       ├── film.css           소개 영상 플레이어
│       ├── proof.css          유저 테스트 지표
│       ├── feedback.css       피드백 카드 · 후기
│       ├── tech.css           아키텍처 다이어그램 · 기술 스택
│       ├── identity.css       브랜드 (이름 · 진주 · 팔레트 · 웜쿨 · 로고 · 타이포)
│       └── team.css           팀원 카드 · 마무리
│
└── js/
    ├── main.js                진입점 — data-page 를 보고 필요한 모듈만 켠다
    │
    ├── data/                  ★ 내용은 전부 여기 있습니다 (마크업 수정 불필요)
    │   ├── site.js            ★ 페이지 목차(NAV) · 외부 링크 · 히어로 대화 시나리오
    │   ├── emotions.js        감정 15종 + 오늘의 기분 5단계
    │   ├── features.js        핵심 기능 3종 (화면 정의 포함)
    │   ├── proof.js           유저 테스트 수치 · 화행 일치율 · Macro F1
    │   ├── feedback.js        1차 피드백 6건 · 2차 후기 3건
    │   ├── tech.js            아키텍처 노드 · 기술 스택 · 규모 수치
    │   ├── identity.js        ★ 이름의 뜻 · 진주 모티프 · 색의 뜻 · 웜쿨 · 규칙
    │   ├── team.js            ★ 팀원 6명 (포트폴리오 링크 여기서 연결)
    │   └── icons.js           lucide 아이콘 path 모음 + icon() 함수
    │
    └── modules/               동작
        ├── chrome.js          ★ 상단바 + 드롭다운 + 모바일 시트 + 푸터
        ├── utils.js           DOM 헬퍼 · 대비 계산 · 카운트업
        ├── render.js          말풍선 · 감정 태그 · 추천 칩 · 도넛 (공용 렌더러)
        ├── reveal.js          스크롤 등장 · 커서 글로우 · 자석 버튼
        ├── heroChat.js        히어로 대화 재생기
        ├── why.js             감정 단서 ON/OFF 스위치
        ├── featureTabs.js     기능 탭 + 실제 화면 렌더
        ├── emotionGrid.js     감정 카드 · 필터 · HEX 복사
        ├── film.js            영상 플레이어
        ├── proof.js           수치 카운트업 · 게이지 · 도넛
        ├── feedbackCards.js   뒤집히는 피드백 카드
        ├── architecture.js    아키텍처 다이어그램 · AI 파이프라인 · 기술 스택
        ├── identity.js        이름 조립 · 진주 층 · 팔레트 · 웜쿨 · 타이포 · 대비
        └── team.js            팀원 카드
```

### 설계 규칙 네 가지

1. **HTML 은 뼈대만.** 반복되는 내용(감정 15장, 팀원 6명, 아키텍처 노드 …)은
   HTML 에 쓰지 않고 `js/data/*.js` 에 두고 JS 가 렌더합니다.
   → 내용을 고칠 때 마크업을 건드릴 필요가 없습니다.
2. **HEX 를 직접 쓰지 않는다.** 색은 반드시 `var(--color-*)` / `var(--emotion-*)` 을 경유합니다.
   `css/00-tokens.css` 의 `[1] CI 원색` 블록만 바꾸면 화면 전체 톤이 바뀝니다.
3. **연출은 `[data-reveal]` 하나로 통일.** `js/modules/reveal.js` 가 관찰해서 `.is-in` 을 붙입니다.
4. **폰 목업을 쓰지 않는다.** 앱 화면을 보여 줄 때는 폰 껍데기 · 노치 · 하단 내비를 두르지 않고
   윤곽선 하나(`.chat-window`)로만 감쌉니다. 껍데기가 없으니 좁은 화면에서 내용이 눌리지 않고,
   글자를 그대로 읽을 수 있습니다(접근성 · SEO). 히어로와 기능 페이지가 **같은 컴포넌트**를 씁니다.

---

## 4. 자주 하는 수정

### 🔗 팀원 포트폴리오 연결하기

`js/data/team.js` 에서 해당 멤버의 `portfolio` 값만 채우면 됩니다.

```js
{
  name: "황민희",
  // ...
  portfolio: "https://github.com/minhee",   // ← 이 한 줄
}
```

- 값이 있으면 → 카드 전체가 `<a>` 가 되고 **"포트폴리오 보기 →"** 가 활성화됩니다.
- 값이 `""` 이면 → 카드는 그대로, **"포트폴리오 준비 중"** 으로 표시됩니다.
- 두 경우의 카드 크기·구조가 완전히 같아서, 나중에 한 명씩 채워도 레이아웃이 흔들리지 않습니다.

### 🙂 팀원 아바타 바꾸기

아바타는 발표자료 팀원 소개 슬라이드의 **원본 SVG 파일**입니다(`assets/team/*.svg`).
`js/data/team.js` 의 `avatar` 에 경로가 적혀 있습니다.

```js
avatar: "assets/team/ha-suyeon.svg",
```

사진으로 바꾸려면 같은 자리에 이미지 경로를 넣으면 됩니다.

`hair` 는 `short` · `sidePart` · `bob` · `bangs` · `medium` · `long` 여섯 가지입니다.
색은 카드의 `tone`(감정 토큰)에서 자동으로 나옵니다.

사진을 쓰려면 `assets/team/` 폴더를 만들어 이미지를 두고 `avatar: "assets/team/minhee.jpg"`
를 채우면 일러스트 대신 사진이 들어갑니다.

### 🧭 목차 · 페이지 구성 바꾸기

`js/data/site.js` 의 `NAV` 하나만 고칩니다. 상단바 · 드롭다운 · 모바일 시트가 함께 바뀝니다.

```js
{
  id: "product",              // <body data-page="product"> 와 같아야 한다
  label: "제품",              // 상단바에 보이는 이름
  file: "product.html",
  summary: "드롭다운 왼쪽에 붙는 한 줄 소개",
  children: [
    { hash: "features", label: "핵심 기능 3종", desc: "감정 분석 · 답장 추천 · 대시보드" },
    // hash 는 그 페이지 <section> 의 id
  ],
}
```

### 🔗 서비스 · 저장소 · 발표자료 링크 연결하기

`js/data/site.js` 의 `LINKS` 를 채웁니다.

```js
export const LINKS = {
  service: "https://emour.example.com",   // 상단바 CTA · 마무리 CTA
  repository: "https://github.com/...",   // 상단바 GitHub · 마무리
  deck: "https://.../발표자료.pdf",        // 마무리
  model: "https://huggingface.co/...",    // 푸터
};
```

빈 문자열(`""`)로 두면 해당 버튼은 **자동으로 숨겨집니다.** 죽은 링크가 남지 않습니다.

### 🎨 브랜드 색 바꾸기

`css/00-tokens.css` 의 `[1] CI 원색` 블록만 고칩니다. 나머지는 전부 이 값을 참조합니다.

단, **감정 15색과 기분 5색은 백엔드 `EmotionType` 열거형과 1:1** 이므로
색 개수를 늘리거나 줄이려면 백엔드와 함께 진행해야 합니다.
(HEX 값은 `css/00-tokens.css` 와 `js/data/emotions.js` 두 곳에 있습니다 —
JS 쪽 값은 HEX 복사 배지와 대비 계산에 쓰이므로 함께 맞춰 주세요.)

### 🏷 브랜드 이야기 고치기

브랜드 페이지의 글은 전부 `js/data/identity.js` 에 있습니다.

- `NAMING` — 이름이 만들어진 순서 (글자 단위 조립은 JS 가 알아서 합니다)
- `MOTIF` — 핑크 진주 모티프와 진주 층 5개
- `ORIGIN_PALETTE` — 색마다 담긴 **뜻**
- `TEMPERATURE` — 웜톤 / 쿨톤 두 축
- `LOGO_PARTS` · `LOGO_NOTE` · `TYPE_SCALE` · `RULES`

> ⚠️ `ORIGIN_PALETTE` 의 HEX 는 BI/CI 가이드 지면에서 눈으로 읽어 옮긴 값입니다.
> 가이드 원본 수치로 바로잡아 주세요. 나머지 값은 앱 토큰과 일치합니다.

### 📝 문구 바꾸기

- 페이지 제목 · 섹션 제목 → 해당 `.html` (섹션마다 `<h2 class="section-title">`)
- 나머지 내용 → `js/data/` 의 해당 파일

### 🎬 영상 교체하기

`assets/video/emour-promo.mp4` 를 덮어쓰면 됩니다. 파일명이 다르면
`index.html` 의 `<source src="...">` 한 줄만 바꿔 주세요.

영상이 커서 저장소가 부담스럽다면, YouTube 등에 올린 뒤 `film__frame` 안의
`<video>` 를 `<iframe>` 으로 바꾸는 방법도 있습니다. (현재는 `preload="none"` 이라
**재생 버튼을 누르기 전까지는 한 바이트도 내려받지 않습니다.**)

### 🎨 스타일 파일 추가할 때

CSS 파일을 새로 만들면 **6개 HTML 의 `<link>` 목록에 모두 넣어야 합니다.**
빌드 도구가 없어서 자동으로 합쳐지지 않습니다. (그래서 되도록 기존 파일에 덧붙이는 편이 낫습니다)

---

## 5. 인터랙션 목록

| 위치 | 동작 |
| --- | --- |
| 전역 상단바 | 항목에 올리면 **그 페이지의 상세 목차 패널**이 펼쳐짐 · 탭 키 · ↓ · Esc 지원 |
| 전역 상단바 | 지금 보는 페이지 표시 · 페이지 안에서 스크롤하면 패널의 현재 섹션에 점이 붙음 |
| 모바일 | 햄버거 → 시트, 페이지마다 아코디언으로 상세 목차 펼침 |
| 홈 히어로 | 대화가 타이핑되고 → AI 분석 → 감정 태그가 붙고 → 추천 칩이 뜨는 과정을 반복 재생 |
| 홈 기획 배경 | **감정 단서 ON/OFF 스위치** — 같은 대화가 무채색 ↔ 감정 표시로 전환 |
| 제품 · 핵심 기능 | 탭 3개 전환 (마우스 · ← → Home End 키) · 화면이 실시간 교체 |
| 제품 · 감정 시스템 | 극성 필터 4종 · 카드 클릭 시 HEX 복사 · 라벨 무한 흐름 띠 |
| 홈 · 소개 영상 | 커스텀 플레이어 (재생 · 음소거 · 전체화면 · 진행 막대 클릭 이동) |
| 검증 | 화면에 들어오면 숫자가 세어 올라가고 게이지 · 도넛이 채워짐 |
| 검증 · 피드백 | 카드를 누르면 "사용자 의견" → "개선 방향" 으로 뒤집힘 · 전체 뒤집기 버튼 |
| 브랜드 · 이름 | Emotion / Amour 에서 덜어낸 글자에 취소선, 남긴 글자만 브랜드색으로 |
| 브랜드 · 진주 | 화면에 들어오면 진주 층이 안쪽부터 순서대로 부풀어 오름 |
| 브랜드 · 팔레트 | 스와치에 올리면 넓어지며 그 색의 **뜻**이 아래에 교체됨 |
| 전역 | 스크롤 진행바 · 커서 글로우 · 자석 버튼 · 등장 연출 |

---

## 6. 접근성 · 성능

- `prefers-reduced-motion: reduce` 를 요청한 사용자에게는 **모든 애니메이션이 꺼지고**
  최종 상태만 보입니다. (히어로 대화도 재생 없이 결과만 표시)
- 탭은 `role="tablist"` 규약을 지키고 방향키로 이동합니다.
  스위치는 `role="switch"`, 뒤집기 카드는 `aria-pressed` 로 상태를 알립니다.
- 상단바 드롭다운은 마우스뿐 아니라 **탭 키 포커스로도 열리고**, ↓ 로 패널 안으로 들어가며
  Esc 로 닫고 원래 항목으로 포커스가 돌아옵니다.
- 대비: 흰 글씨를 얹는 버튼은 쿨톤 로즈(`--color-action`)만 씁니다.
  브랜드 페이지의 대비값은 페이지가 열릴 때 WCAG 공식으로 직접 계산해 표시합니다.
- 화면 밖으로 나가면 히어로 대화 재생과 영상 재생이 **자동으로 멈춥니다.**
- 페이지마다 필요한 JS 모듈만 실행됩니다. 외부 요청은 서체(Pretendard CDN) 하나뿐이고,
  실패해도 시스템 서체로 자연스럽게 떨어집니다.

---

## 7. 브라우저 지원

Chrome / Edge / Safari / Firefox 최신 버전 기준입니다.
`color-mix()` · `aspect-ratio` · `mask-image` 를 쓰므로 2023년 이후 브라우저가 필요합니다.

---

## 8. 출처

- 아이콘: [lucide](https://lucide.dev) (ISC License) © Lucide Contributors
- 서체: [Pretendard](https://github.com/orioncactus/pretendard) (OFL)
- 색 · 타이포 값: `frontend/src/styles/tokens.css` · `Emour_BI_CI_가이드.pdf`
- 감정 15종 스펙: `frontend/src/utils/emotions.js` · `감정_15종_표시명_컬러_아이콘_스펙.pdf`
- 채팅 UI 규격: `frontend/src/components/chat/` (MessageBubble · SuggestionChips · ChatInputBar · ChatHeader)
- 팀원 아바타 · 수치: 공통 프로젝트 발표자료
