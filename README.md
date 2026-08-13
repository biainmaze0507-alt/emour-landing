# Emour Landing

커플 대화 기반 감정 분석 및 회고 서비스 **Emour** 의 소개 사이트 저장소입니다.

빌드 도구가 없습니다. 순수 HTML + CSS + ES Module 로만 되어 있어서
`docs/` 폴더를 그대로 정적 호스팅에 올리면 바로 동작합니다.

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
    ├── assets/    로고 · 파비콘 · 소개 영상
    ├── css/       디자인 토큰 + 섹션별 스타일
    ├── js/        data(내용) + modules(동작)
    ├── .nojekyll
    └── README.md  ← 폴더 구조 · 수정 가이드 (여기부터 읽으세요)
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

### 배포 전에 하나 고치면 좋은 것

카카오톡 · 슬랙에 링크를 공유할 때 뜨는 미리보기 카드가 지금은 나오지 않습니다.
`og:image` 가 상대경로 SVG 인데, Open Graph 는 전체 주소만 인식하고
카카오톡 · 트위터 · 슬랙은 SVG 를 읽지 않기 때문입니다.

저장소 주소가 정해지면 1200×630 PNG 를 `docs/assets/og-image.png` 로 넣고
**6개 HTML 의** 해당 두 줄을 이렇게 바꿔 주세요.

```html
<meta property="og:image" content="https://<계정>.github.io/<저장소>/assets/og-image.png">
<meta property="og:url" content="https://<계정>.github.io/<저장소>/">
```

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
| 팀원 아바타 이미지 | `docs/assets/team/*.svg` · 경로는 `docs/js/data/team.js` 의 `avatar` |
| 서비스 · 저장소 · 발표자료 링크 | `docs/js/data/site.js` 의 `LINKS` |
| 상단바 목차 · 페이지 구성 | `docs/js/data/site.js` 의 `NAV` (한 곳만 고치면 전 페이지 반영) |
| 브랜드 이야기 (이름 · 색의 뜻) | `docs/js/data/identity.js` |
| 브랜드 색 변경 | `docs/css/00-tokens.css` 의 `[1] CI 원색` 블록 |
| 수치 · 문구 등 내용 | `docs/js/data/` 의 해당 파일 |
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
