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

## 2. 여섯 페이지가 기준입니다

한 페이지에 전부 담지 않고 **여섯 주제로 나눴습니다.** 스크롤이 끝없이 길어지면
읽는 사람이 지금 어디쯤인지 알 수 없고, 발표 중에 특정 부분만 보여 주기도 어렵기 때문입니다.
페이지마다 주소가 따로 있으니 "감정 15종만 보세요" 하고 링크를 줄 수 있습니다.

**폴더도 이 여섯 개를 기준으로 나뉘어 있습니다.** 어떤 페이지를 고치려면
그 이름의 폴더 세 곳(`css/pages/<페이지>`, `js/pages/<페이지>`, 그리고 `<페이지>.html`)만 보면 됩니다.

| 페이지 | HTML | `data-page` | 스타일 | 동작 · 내용 |
| --- | --- | --- | --- | --- |
| 홈 | `index.html` | `home` | `css/pages/home/` | `js/pages/home/` |
| 제품 | `product.html` | `product` | `css/pages/product/` | `js/pages/product/` |
| 검증 | `proof.html` | `proof` | `css/pages/proof/` | `js/pages/proof/` |
| 기술 | `tech.html` | `tech` | `css/pages/tech/` | `js/pages/tech/` |
| 브랜드 | `brand.html` | `brand` | `css/pages/brand/` | `js/pages/brand/` |
| 팀 | `team.html` | `team` | `css/pages/team/` | `js/pages/team/` |

각 페이지가 담는 내용은 이렇습니다.

| 페이지 | 담는 내용 |
| --- | --- |
| 홈 | 히어로(살아 있는 대화 창) · 기획 배경 · 기능 요약 3장 · 소개 영상 · 마무리 |
| 제품 | 핵심 기능 3종(탭) · 감정 15종 체계 · 오늘의 기분 5단계 |
| 검증 | 유저 테스트 수치 · 화행 일치율 · Macro F1 여정 · 피드백 반영 · 사용 후기 |
| 기술 | 시스템 아키텍처 · 감정 분석 모델 · 기술 스택 |
| 브랜드 | 이름의 뜻 · 디자인 모티프 · 컬러 아이덴티티 · 색의 두 온도 · 심볼 · 타이포 |
| 팀 | 팀원 6명 · 마무리 |

`<body data-page="...">` 값이 **어떤 JS 모듈을 켤지** 정합니다 (`js/main.js` 의 `PAGE_MODULES`).
그래서 페이지를 늘리거나 섹션을 옮길 때 HTML 의 `<script>` 를 건드릴 필요가 없습니다.

### 상단바와 푸터는 HTML 에 없습니다

페이지가 여섯 장이라 상단바 마크업을 파일마다 복사해 두면 목차를 한 번 고칠 때 여섯 곳을 고쳐야 합니다.
그래서 HTML 에는 빈 껍데기만 두고,

```html
<header class="site-nav"></header>
<footer class="site-footer"></footer>
```

`js/shared/chrome.js` 가 `js/data/site.js` 의 `NAV` 하나로 상단바 · 메가패널 · 모바일 시트 ·
푸터를 모두 만듭니다. **목차를 고칠 곳은 `js/data/site.js` 한 곳뿐입니다.**

---

## 3. 폴더 구조

규칙은 하나입니다. **여러 페이지가 함께 쓰면 `base` · `shared` · `data`,
한 페이지만 쓰면 `pages/<페이지>`.**

```
docs/
├── index.html                 홈
├── product.html               제품
├── proof.html                 검증
├── tech.html                  기술
├── brand.html                 브랜드
├── team.html                  팀
├── .nojekyll                  GitHub Pages 용 표식 (밑줄 폴더를 막지 않게)
├── README.md                  이 문서
│
├── assets/
│   ├── logo-wordmark.svg      하트 + 글자가 함께 든 완성형 로고
│   ├── logo-mark.svg          하트 심볼 단독 (앱 아이콘 · 파비콘용)
│   ├── favicon.svg            파비콘
│   ├── og-image.png           카카오톡 · 슬랙 공유 카드 (1200×630)
│   ├── team/                  팀원 아바타 6개 (발표자료 원본 SVG)
│   └── video/
│       └── emour-promo.mp4    소개 영상 (재생 버튼을 눌러야 내려받음)
│
├── css/
│   ├── base/                  ★ 여섯 페이지가 모두 불러옵니다
│   │   ├── 00-tokens.css      ★ 색 · 타이포 · 간격 · 모션 · 레이아웃 토큰의 단일 출처
│   │   ├── 01-base.css        리셋 · 기본 타이포 · 본문 좌우 맞춤 규칙
│   │   ├── 02-layout.css      셸 · 상단바 · 메가패널 · 페이지 머리글 · 푸터 · 다음 페이지
│   │   ├── 03-motion.css      스크롤 등장 연출 · 반복 애니메이션
│   │   ├── 04-components.css  ★ 버튼 · 칩 · 표면 · 감정 태그 · 대화 창 · 말풍선 · 추천 칩 · 리포트
│   │   └── 05-closing.css     마무리 블록 (홈 · 팀 페이지의 끝)
│   │
│   └── pages/                 그 페이지에서만 쓰는 스타일
│       ├── home/
│       │   ├── hero.css       첫 화면 · 살아 있는 대화 창의 자리와 크기
│       │   ├── why.css        기획 배경 (감정 단서 ON/OFF)
│       │   ├── glance.css     기능 요약 3장 (제품 페이지로 가는 미리보기 카드)
│       │   └── film.css       소개 영상 플레이어
│       ├── product/
│       │   ├── features.css   기능 탭 · 화면 · 근거 패널
│       │   └── emotions.css   감정 15종 카드 · 4분류 · 기분 5단계
│       ├── proof/
│       │   ├── proof.css      수치 띠 · 만족도 게이지 · 도넛 · 화행 · Macro F1
│       │   └── feedback.css   뒤집히는 피드백 카드 · 사용 후기
│       ├── tech/
│       │   └── tech.css       아키텍처 다이어그램 · AI 파이프라인 · 기술 스택
│       ├── brand/
│       │   └── identity.css   이름 · 모티프 · 팔레트 · 두 온도 · 심볼 · 타이포
│       └── team/
│           └── team.css       팀원 카드
│
└── js/
    ├── main.js                진입점 — data-page 를 보고 그 페이지 모듈만 켠다
    │
    ├── shared/                여섯 페이지가 함께 쓰는 동작
    │   ├── chrome.js          ★ 상단바 · 메가패널 · 모바일 시트 · 푸터 · 맨 위로
    │   ├── reveal.js          스크롤 등장 연출 · 커서 글로우
    │   ├── render.js          말풍선 · 감정 태그 · 추천 칩 · 도넛 · 기분 흐름 그래프
    │   └── utils.js           DOM 헬퍼 · 카운트업 · 등장 관찰 · 소수 자리 계산
    │
    ├── data/                  ★ 여러 페이지가 함께 쓰는 내용
    │   ├── site.js            ★ 목차(NAV) · 외부 링크 · 히어로 대화 시나리오 · 요약 수치
    │   ├── emotions.js        감정 15종 · 4분류 · 오늘의 기분 5단계
    │   └── icons.js           lucide 아이콘 path 모음 + icon() 함수
    │
    └── pages/                 그 페이지에서만 쓰는 동작과 내용
        ├── home/
        │   ├── heroChat.js    히어로 대화 재생기 (입력 → 교정 → 추천)
        │   ├── heroFacts.js   히어로 아래 요약 수치 카운트업
        │   ├── why.js         감정 단서 ON/OFF 스위치
        │   └── film.js        영상 플레이어
        ├── product/
        │   ├── featureTabs.js     기능 탭 + 실제 화면 렌더
        │   ├── emotionGrid.js     감정 카드 · 4분류 필터 · 라벨 띠 · 기분 5단계
        │   └── features.data.js   ★ 핵심 기능 3종 (화면 정의 포함)
        ├── proof/
        │   ├── proof.js           수치 카운트업 · 게이지 · 도넛 · 화행 · Macro F1
        │   ├── feedbackCards.js   뒤집히는 피드백 카드 · 사용 후기
        │   ├── proof.data.js      ★ 유저 테스트 수치 · 화행 일치율 · Macro F1
        │   └── feedback.data.js   ★ 1차 피드백 6건 · 2차 후기 3건
        ├── tech/
        │   ├── architecture.js    아키텍처 다이어그램 · AI 파이프라인 · 기술 스택
        │   └── tech.data.js       ★ 아키텍처 노드 · 기술 스택 · 규모 수치
        ├── brand/
        │   ├── identity.js        이름 조립 · 모티프 · 팔레트 · 두 온도 · 심볼 · 타이포
        │   └── identity.data.js   ★ 이름의 뜻 · 모티프 · 색의 뜻 · 두 온도 · 로고
        └── team/
            ├── team.js            팀원 카드
            └── team.data.js       ★ 팀원 6명
```

**`.data.js` 로 끝나는 파일이 그 페이지의 글과 수치입니다.** 나머지는 동작입니다.
문구를 고칠 때는 `.data.js` 와 `js/data/` 만 열면 됩니다.

### 설계 규칙 다섯 가지

1. **HTML 은 뼈대만.** 반복되는 내용(감정 15장, 팀원 6명, 아키텍처 노드 …)은
   HTML 에 쓰지 않고 `*.data.js` 에 두고 JS 가 렌더합니다.
   → 내용을 고칠 때 마크업을 건드릴 필요가 없습니다.
2. **HEX 를 직접 쓰지 않는다.** 색은 반드시 `var(--color-*)` / `var(--emotion-*)` 을 경유합니다.
   `css/base/00-tokens.css` 의 `[1] CI 원색` 블록만 바꾸면 화면 전체 톤이 바뀝니다.
3. **연출은 `[data-reveal]` 하나로 통일.** `js/shared/reveal.js` 가 관찰해서 `.is-in` 을 붙입니다.
4. **폰 목업을 쓰지 않는다.** 앱 화면을 보여 줄 때는 폰 껍데기 · 노치 · 하단 내비를 두르지 않고
   윤곽선 하나(`.chat-window`)로만 감쌉니다. 껍데기가 없으니 좁은 화면에서 내용이 눌리지 않고,
   글자를 그대로 읽을 수 있습니다(접근성 · SEO). 히어로와 기능 페이지가 **같은 컴포넌트**를 씁니다.
5. **두 페이지 이상이 쓰면 공용으로 올린다.** 한 페이지 폴더에 둔 스타일을 다른 페이지가
   가져다 쓰기 시작하면 그 페이지는 그 파일을 불러오지 않으므로 조용히 깨집니다.
   → `base` · `shared` · `data` 로 옮기세요. (마무리 블록이 홈과 팀 양쪽에서 쓰여
   `css/base/05-closing.css` 로 올라가 있습니다)

---

## 4. 자주 하는 수정

### 🧭 목차 · 페이지 구성 바꾸기

`js/data/site.js` 의 `NAV` 하나만 고칩니다. 상단바 · 메가패널 · 모바일 시트 · 푸터가 함께 바뀝니다.

```js
{
  id: "product",              // <body data-page="product"> 와 같아야 한다
  label: "제품",              // 상단바에 보이는 이름
  file: "product.html",
  summary: "메가패널 왼쪽에 붙는 한 줄 소개",
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
  repository: "https://github.com/...",   // 마무리
  deck: "https://.../발표자료.pdf",        // 마무리
  model: "https://huggingface.co/...",    // 기술 페이지 모델 카드
};
```

빈 문자열(`""`)로 두면 해당 버튼은 **자동으로 숨겨집니다.** 죽은 링크가 남지 않습니다.

### 🎨 브랜드 색 바꾸기

`css/base/00-tokens.css` 의 `[1] CI 원색` 블록만 고칩니다. 나머지는 전부 이 값을 참조합니다.

단, **감정 15색과 기분 5색은 백엔드 `EmotionType` 열거형과 1:1** 이므로
색 개수를 늘리거나 줄이려면 백엔드와 함께 진행해야 합니다.
(HEX 값은 `css/base/00-tokens.css` 와 `js/data/emotions.js` 두 곳에 있으니 함께 맞춰 주세요.)

### 🏷 브랜드 이야기 고치기

브랜드 페이지의 글은 전부 `js/pages/brand/identity.data.js` 에 있습니다.

- `NAMING` — 이름이 만들어진 순서 (글자 단위 조립은 JS 가 알아서 합니다)
- `MOTIF` — 동심원 세 층의 이름과 뜻
- `ORIGIN_PALETTE` — 색마다 담긴 **뜻**
- `TEMPERATURE` — 색의 두 온도
- `LOGO_BUILD` — 심볼을 이루는 두 획 설명 (격자 위 로고는 `brand.html` 에 있습니다)
- `LOGO_PARTS` · `TYPE_SCALE`

> `ORIGIN_PALETTE` 의 색은 모두 BI/CI 가이드에 실려 있는 값입니다.
> 가이드에 없는 색은 이 페이지에 등장하지 않습니다.

### 🙂 팀원 바꾸기

`js/pages/team/team.data.js` 하나만 고칩니다.

```js
{
  name: "하수연",
  roles: ["Frontend"],
  tone: "--emotion-excitement",          // 카드에 번지는 색 (감정 토큰)
  avatar: "assets/team/ha-suyeon.svg",   // 발표자료 원본 SVG
  blurb: "한 줄 소개",
  tags: ["담당한 작업", "..."],
}
```

사진으로 바꾸려면 `assets/team/` 에 이미지를 두고 `avatar` 경로만 바꾸면 됩니다.

### 📝 문구 바꾸기

- 페이지 제목 · 섹션 제목 → 해당 `.html` (섹션마다 `<h2 class="section-title">`)
- 나머지 내용 → 그 페이지의 `*.data.js`, 또는 여러 페이지가 함께 쓰면 `js/data/`

### 🎬 영상 교체하기

`assets/video/emour-promo.mp4` 를 덮어쓰면 됩니다. 파일명이 다르면
`index.html` 의 `<source src="...">` 한 줄만 바꿔 주세요.

현재는 `preload="none"` 이라 **재생 버튼을 누르기 전까지는 한 바이트도 내려받지 않습니다.**

### 🎨 스타일 · 모듈 파일 추가할 때

- **그 페이지에서만 쓰는 스타일**이면 `css/pages/<페이지>/` 에 만들고,
  그 페이지 HTML 의 `<link>` 목록에만 넣습니다.
- **여러 페이지가 쓰는 스타일**이면 `css/base/` 에 만들고 **여섯 HTML 모두**에 넣습니다.
- JS 모듈을 추가하면 `js/main.js` 의 `PAGE_MODULES` 에 등록합니다. HTML 은 건드리지 않습니다.

빌드 도구가 없어서 자동으로 합쳐지지 않습니다.

---

## 5. 인터랙션 목록

| 위치 | 동작 |
| --- | --- |
| 전역 상단바 | 항목에 닿으면 **화면 폭을 다 쓰는 메가패널** 하나가 내려옴 · 탭 키 · ↓ · Esc 지원 |
| 전역 상단바 | 지금 보는 페이지는 항목 아래 점으로 표시 · 스크롤하면 패널의 현재 섹션에도 점이 붙음 |
| 모바일 | 햄버거 → 시트, 페이지마다 아코디언으로 상세 목차 펼침 |
| 홈 히어로 | 대화가 오가고 → 입력창에 초안을 치고 → 교정을 누르면 → 추천 세 갈래가 올라와 오른쪽으로 넘어감 (창 높이는 고정) |
| 홈 기획 배경 | **감정 단서 ON/OFF 스위치** — 같은 대화가 무채색 ↔ 감정 표시로 전환 |
| 제품 · 핵심 기능 | 탭 3개 전환 (마우스 · ← → Home End 키) · 화면이 실시간 교체 |
| 제품 · 감정 분석 화면 | "AI 감정 분석 중" 이 잠깐 돌고 결과 감정으로 바뀜 |
| 제품 · 감정 시스템 | 4분류 필터 · 라벨 무한 흐름 띠 |
| 홈 · 소개 영상 | 커스텀 플레이어 (재생 · 음소거 · 전체화면 · 진행 막대 클릭 이동) |
| 검증 | 화면에 들어오면 숫자가 세어 올라가고 게이지 · 도넛이 채워짐 |
| 검증 · 피드백 | 카드를 누르면 "사용자 의견" → "개선 방향" 으로 뒤집힘 · 전체 뒤집기 버튼 |
| 브랜드 · 이름 | Emotion / Amour 에서 덜어낸 글자에 취소선, 남긴 글자만 브랜드색으로 |
| 브랜드 · 심볼 | 격자 위에 심볼 단독과 기본형(심볼+워드마크)을 세로로 나란히 |
| 브랜드 · 팔레트 | 색마다 한 줄씩 헤어라인으로 끊어 담긴 **뜻**을 함께 적음 |
| 전역 | 스크롤 진행바 · 우측 하단 맨 위로 버튼 · 등장 연출 |

---

## 6. 접근성 · 성능

- `prefers-reduced-motion: reduce` 를 요청한 사용자에게는 **모든 애니메이션이 꺼지고**
  최종 상태만 보입니다. (히어로 대화도 재생 없이 결과만 표시)
- 탭은 `role="tablist"` 규약을 지키고 방향키로 이동합니다.
  스위치는 `role="switch"`, 뒤집기 카드는 `aria-pressed` 로 상태를 알립니다.
- 상단바 메가패널은 마우스뿐 아니라 **탭 키 포커스로도 열리고**, ↓ 로 패널 안으로 들어가며
  Esc 로 닫고 원래 항목으로 포커스가 돌아옵니다.
- 대비: 흰 글씨를 얹는 버튼은 쿨톤 로즈(`--color-action`, 4.73:1)만 씁니다.
- 화면 밖으로 나가면 히어로 대화 재생과 영상 재생이 **자동으로 멈춥니다.**
- 페이지마다 **자기 CSS 와 자기 JS 모듈만** 불러옵니다.
- 서체(Pretendard)는 굵기별 파일과 가변 파일을 함께 걸어 두고, 가변 글꼴을 쓸 수 있는
  기기에서만 가변을 씁니다. 둘 다 실패해도 시스템 서체로 자연스럽게 떨어집니다.

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
