# Emour Landing

### 🔗 https://biainmaze0507-alt.github.io/emour-landing/

커플 대화 기반 감정 분석 및 회고 서비스 **Emour** 의 소개 사이트 저장소입니다.

빌드 도구가 없습니다. 순수 HTML + CSS + ES Module 로만 되어 있어서
`docs/` 폴더를 그대로 정적 호스팅에 올리면 바로 동작합니다.

폴더는 **여섯 페이지(홈 · 제품 · 검증 · 기술 · 브랜드 · 팀)를 기준으로** 나뉘어 있습니다.
어떤 페이지를 고치려면 그 이름의 폴더만 보면 됩니다.

```
emour-landing/
├── README.md      ← 지금 이 문서 (배포 방법)
└── docs/          ← 실제 사이트. 이 폴더가 통째로 배포됩니다
    ├── index.html      홈
    ├── product.html    제품
    ├── proof.html      검증
    ├── tech.html       기술
    ├── brand.html      브랜드
    ├── team.html       팀
    │
    ├── assets/         로고 · 파비콘 · 공유 카드 · 팀원 아바타 · 소개 영상
    ├── css/
    │   ├── base/       여섯 페이지가 함께 쓰는 토큰 · 레이아웃 · 부품
    │   └── pages/      home · product · proof · tech · brand · team
    ├── js/
    │   ├── main.js     진입점 — data-page 를 보고 그 페이지 모듈만 켠다
    │   ├── shared/     상단바 · 푸터 · 등장 연출 · 공용 렌더러 · 헬퍼
    │   ├── data/       여러 페이지가 함께 쓰는 내용 (목차 · 감정 15종 · 아이콘)
    │   └── pages/      home · product · proof · tech · brand · team
    │                   (동작 `*.js` + 그 페이지의 글과 수치 `*.data.js`)
    ├── .nojekyll
    └── README.md  ← 폴더 구조 · 파일별 내용 · 수정 가이드 (여기부터 읽으세요)
```

---

## 배포 — GitHub Pages

1. 이 폴더를 새 저장소로 만들어 푸시합니다. (저장소는 **Public** 이어야 합니다 —
   무료 계정은 Private 저장소에서 Pages 를 쓸 수 없습니다)

   ```bash
   cd emour-landing
   git init
   git add .
   git commit -m "Add Emour landing page"
   git branch -M main
   git remote add origin https://github.com/<계정>/<저장소>.git
   git push -u origin main
   ```

2. GitHub 저장소에서 **Settings → Pages** 로 이동합니다.
3. **Source: Deploy from a branch** / **Branch: `main`** / **Folder: `/docs`** 를 선택하고 저장합니다.

1~2분 뒤 `https://<계정>.github.io/<저장소>/` 에서 열립니다.
이후 `main` 에 푸시하면 자동으로 다시 배포됩니다.

> 모든 경로가 상대 경로라 하위 경로(`/<저장소>/`)에 배포해도 그대로 동작합니다.
> `docs/.nojekyll` 은 Jekyll 전처리를 건너뛰게 하는 빈 표식 파일입니다. 지우지 마세요.

### 공유 카드

카카오톡 · 슬랙에 링크를 붙이면 `docs/assets/og-image.png` (1200×630) 가 미리보기로 뜹니다.
주소가 바뀌면 **6개 HTML** 의 `og:image` · `og:url` 을 함께 고쳐 주세요.

---

## 로컬에서 보기

`index.html` 을 더블클릭해서 열면 안 됩니다. `file://` 에서는 브라우저가 ES Module 을
CORS 정책으로 막아 상단바조차 그려지지 않습니다. 간이 서버로 여세요.

```bash
cd docs

python -m http.server 5500     # Python
npx serve .                    # Node
```

→ http://localhost:5500

VS Code 를 쓴다면 Live Server 확장을 설치하고 `docs/index.html` 우클릭 → *Open with Live Server*.

---

## 무엇을 어디서 고치나

| 하고 싶은 일 | 고칠 파일 |
| --- | --- |
| 팀원 · 아바타 | `docs/js/pages/team/team.data.js` (이미지는 `docs/assets/team/`) |
| 서비스 · 저장소 · 발표자료 링크 | `docs/js/data/site.js` 의 `LINKS` |
| 상단바 목차 · 페이지 구성 | `docs/js/data/site.js` 의 `NAV` (한 곳만 고치면 전 페이지 반영) |
| 브랜드 이야기 (이름 · 색의 뜻) | `docs/js/pages/brand/identity.data.js` |
| 브랜드 색 변경 | `docs/css/base/00-tokens.css` 의 `[1] CI 원색` 블록 |
| 검증 수치 · 기술 스택 | `docs/js/pages/proof/*.data.js` · `docs/js/pages/tech/tech.data.js` |
| 그 밖의 문구 | 그 페이지의 `docs/js/pages/<페이지>/*.data.js` |
| 섹션 제목 · 순서 | 해당 `docs/*.html` |
| 소개 영상 교체 | `docs/assets/video/emour-promo.mp4` 덮어쓰기 |

자세한 폴더 구조와 설계 규칙은 **[`docs/README.md`](docs/README.md)** 에 있습니다.

---

## 출처

- 아이콘 [lucide](https://lucide.dev) (ISC License) © Lucide Contributors
- 서체 [Pretendard](https://github.com/orioncactus/pretendard) (OFL)
- 색 · 타이포 · 감정 15종 · 채팅 UI 규격은 Emour 본 저장소의
  `frontend/src/styles/tokens.css` · `frontend/src/utils/emotions.js` ·
  `frontend/src/components/chat/` 와 1:1 로 맞춰져 있습니다.

© 2026 Emour
