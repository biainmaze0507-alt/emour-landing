# Emour 랜딩 페이지

커플 대화 기반 감정 분석 및 회고 서비스 **Emour** 의 소개 페이지입니다.

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
CORS 정책으로 막기 때문에 인터랙션이 동작하지 않습니다.
(그 경우를 대비한 안전장치가 있어서 글과 이미지는 보입니다.)

아무 간이 서버나 하나 띄우면 됩니다.

```bash
cd docs

# Python 이 있다면
python -m http.server 5500

# Node 가 있다면
npx serve .

# VS Code 를 쓴다면
# Live Server 확장 설치 후 index.html 우클릭 → "Open with Live Server"
```

→ http://localhost:5500

---

## 2. 배포 (요약)

이 저장소를 GitHub 에 푸시한 뒤
**Settings → Pages → Source: Deploy from a branch → Branch: `main` / Folder: `/docs`** 로 지정하면 끝입니다.

- `.nojekyll` 빈 파일이 이미 들어 있습니다. Jekyll 전처리를 건너뛰게 하는 표식이니 지우지 마세요.
- 모든 경로가 상대 경로라 하위 경로(`/저장소이름/`)에 배포해도 그대로 동작합니다.
- 자세한 절차는 [`../README.md`](../README.md) 에 있습니다.

---

## 3. 폴더 구조

```
docs/
├── index.html                 페이지 전체 골격 (섹션 순서 · 빈 컨테이너)
├── .nojekyll                  GitHub Pages 용 표식
├── README.md                  이 문서
│
├── assets/
│   ├── logo-wordmark.svg      하트 + 글자가 함께 든 완성형 로고
│   ├── logo-mark.svg          하트 심볼 단독 (앱 아이콘 · 파비콘용)
│   ├── favicon.svg            파비콘
│   └── video/
│       └── emour-promo.mp4    소개 영상 (12MB · 재생 버튼을 눌러야 내려받음)
│
├── css/
│   ├── 00-tokens.css          ★ 색 · 타이포 · 간격 · 모션의 단일 출처
│   ├── 01-base.css            리셋 · 기본 타이포 · 공통 텍스트 유틸
│   ├── 02-layout.css          상단바 · 섹션 셸 · 배경 · 푸터
│   ├── 03-motion.css          스크롤 등장 연출 · 반복 애니메이션
│   ├── 04-components.css      버튼 · 칩 · 말풍선 · 앱 목업 등 재사용 조각
│   └── sections/
│       ├── hero.css           01 첫 화면
│       ├── why.css            02 기획 배경
│       ├── features.css       03 핵심 기능
│       ├── emotions.css       04 감정 시스템
│       ├── film.css           05 소개 영상
│       ├── proof.css          06 유저 테스트 · 지표
│       ├── feedback.css       07 피드백 반영 · 후기
│       ├── tech.css           08 시스템 아키텍처
│       ├── identity.css       09 BI / CI
│       └── team.css           10 팀 소개 + 마무리
│
└── js/
    ├── main.js                진입점 — 모듈을 순서대로 켠다
    │
    ├── data/                  ★ 내용은 전부 여기 있습니다 (마크업 수정 불필요)
    │   ├── site.js            링크 · 목차 · 히어로 대화 시나리오 · 푸터
    │   ├── emotions.js        감정 15종 + 오늘의 기분 5단계
    │   ├── features.js        핵심 기능 3종 (목업 화면 정의 포함)
    │   ├── proof.js           유저 테스트 수치 · 화행 일치율 · Macro F1
    │   ├── feedback.js        1차 피드백 6건 · 2차 후기 3건
    │   ├── tech.js            아키텍처 노드 · 기술 스택 · 규모 수치
    │   ├── identity.js        로고 · 코어 팔레트 · 타이포 스케일 · 규칙
    │   ├── team.js            ★ 팀원 6명 (포트폴리오 링크 여기서 연결)
    │   └── icons.js           lucide 아이콘 path 모음 + icon() 함수
    │
    └── modules/               동작 (각 파일이 섹션 하나를 담당)
        ├── utils.js           DOM 헬퍼 · 대비 계산 · 카운트업
        ├── render.js          감정 태그 · 말풍선 · 도넛 SVG (공용 렌더러)
        ├── nav.js             상단바 · 목차 · 진행바 · 모바일 시트
        ├── reveal.js          스크롤 등장 · 커서 글로우 · 자석 버튼
        ├── heroChat.js        히어로 대화 재생기
        ├── why.js             감정 단서 ON/OFF 스위치
        ├── featureTabs.js     기능 탭 + 앱 목업 렌더
        ├── emotionGrid.js     감정 카드 · 필터 · HEX 복사
        ├── film.js            영상 플레이어
        ├── proof.js           수치 카운트업 · 게이지 · 도넛
        ├── feedbackCards.js   뒤집히는 피드백 카드
        ├── architecture.js    아키텍처 다이어그램 · 기술 스택
        ├── identity.js        팔레트 · 대비 계산 · 타이포 스케일
        ├── team.js            팀원 카드
        └── footer.js          푸터 링크 · 연도
```

### 설계 규칙 세 가지

1. **HTML 은 뼈대만.** 반복되는 내용(감정 15장, 팀원 6명, 아키텍처 노드 …)은
   `index.html` 에 쓰지 않고 `js/data/*.js` 에 두고 JS 가 렌더합니다.
   → 내용을 고칠 때 마크업을 건드릴 필요가 없습니다.
2. **HEX 를 직접 쓰지 않는다.** 색은 반드시 `var(--color-*)` / `var(--emotion-*)` 을 경유합니다.
   `css/00-tokens.css` 의 `[1] CI 원색` 블록만 바꾸면 화면 전체 톤이 바뀝니다.
3. **연출은 `[data-reveal]` 하나로 통일.** `js/modules/reveal.js` 가 관찰해서 `.is-in` 을 붙입니다.

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

사진을 넣고 싶다면 `assets/team/` 폴더를 만들어 이미지를 두고 `avatar: "assets/team/minhee.jpg"`
를 채우면 됩니다. 비워 두면 이름 이니셜 모노그램이 자동 생성됩니다.

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

`css/00-tokens.css` 의 `[1] CI 원색 8색` 블록만 고칩니다. 나머지는 전부 이 값을 참조합니다.

단, **감정 15색과 기분 5색은 백엔드 `EmotionType` 열거형과 1:1** 이므로
색 개수를 늘리거나 줄이려면 백엔드와 함께 진행해야 합니다.
(HEX 값은 `css/00-tokens.css` 와 `js/data/emotions.js` 두 곳에 있습니다 —
JS 쪽 값은 HEX 복사 배지와 대비 계산에 쓰이므로 함께 맞춰 주세요.)

### 📝 문구 바꾸기

- 섹션 제목 · 리드 문구 → `index.html` (섹션마다 `<h2 class="section-title">`)
- 나머지 내용 → `js/data/` 의 해당 파일

### 🎬 영상 교체하기

`assets/video/emour-promo.mp4` 를 덮어쓰면 됩니다. 파일명이 다르면
`index.html` 의 `<source src="...">` 한 줄만 바꿔 주세요.

영상이 커서 저장소가 부담스럽다면, YouTube 등에 올린 뒤 `film.__frame` 안의
`<video>` 를 `<iframe>` 으로 바꾸는 방법도 있습니다. (현재는 `preload="none"` 이라
**재생 버튼을 누르기 전까지는 한 바이트도 내려받지 않습니다.**)

---

## 5. 인터랙션 목록

| 섹션 | 동작 |
| --- | --- |
| 히어로 | 대화가 타이핑되고 → AI 분석 → 감정 태그가 붙고 → 답장 3안이 뜨는 과정을 반복 재생 |
| 히어로 | 배경에 감정 라벨 8개가 천천히 떠다님 |
| 기획 배경 | **감정 단서 ON/OFF 스위치** — 같은 대화가 무채색 ↔ 감정 표시로 전환 |
| 핵심 기능 | 탭 3개 전환 (마우스 · ← → Home End 키) · 앱 목업 화면이 실시간 교체 |
| 감정 시스템 | 극성 필터 4종 · 카드 클릭 시 HEX 복사 · 라벨 무한 흐름 띠 |
| 소개 영상 | 커스텀 플레이어 (재생 · 음소거 · 전체화면 · 진행 막대 클릭 이동) |
| 유저 테스트 | 화면에 들어오면 숫자가 세어 올라가고 게이지 · 도넛이 채워짐 |
| 피드백 | 카드를 누르면 "사용자 의견" → "개선 방향" 으로 뒤집힘 · 전체 뒤집기 버튼 |
| 디자인 | 팔레트 스와치에 올리면 넓어지며 설명 교체 · 대비값 실시간 계산 |
| 전역 | 스크롤 진행바 · 현재 섹션 표시 · 커서 글로우 · 자석 버튼 · 등장 연출 |

---

## 6. 접근성 · 성능

- `prefers-reduced-motion: reduce` 를 요청한 사용자에게는 **모든 애니메이션이 꺼지고**
  최종 상태만 보입니다. (히어로 대화도 재생 없이 결과만 표시)
- 탭은 `role="tablist"` 규약을 지키고 방향키로 이동합니다.
  스위치는 `role="switch"`, 뒤집기 카드는 `aria-pressed` 로 상태를 알립니다.
- 대비: 흰 글씨를 얹는 버튼은 `--color-action`(#C14A67, **4.73:1**)만 씁니다.
  본문은 12.90:1 (AAA). 이 값들은 페이지가 열릴 때 WCAG 공식으로 직접 계산해 표시합니다.
- 화면 밖으로 나가면 히어로 대화 재생과 영상 재생이 **자동으로 멈춥니다.**
- 외부 요청은 서체(Pretendard CDN) 하나뿐이고, 실패해도 시스템 서체로 자연스럽게 떨어집니다.

---

## 7. 브라우저 지원

Chrome / Edge / Safari / Firefox 최신 버전 기준입니다.
`color-mix()`, `aspect-ratio`, `:has()` 미사용, `overflow: clip`, CSS 중첩 미사용 —
2023년 이후 브라우저면 문제없이 동작합니다.

---

## 8. 출처

- 아이콘: [lucide](https://lucide.dev) (ISC License) © Lucide Contributors
- 서체: [Pretendard](https://github.com/orioncactus/pretendard) (OFL)
- 색 · 타이포 값: `frontend/src/styles/tokens.css` · `Emour_BI_CI_가이드.pdf`
- 감정 15종 스펙: `frontend/src/utils/emotions.js` · `감정_15종_표시명_컬러_아이콘_스펙.pdf`
- 수치: `15기_공통PJT_발표자료_B208.pdf` · `DOCS/` · `exec/`
