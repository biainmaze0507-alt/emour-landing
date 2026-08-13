/**
 * js/modules/chrome.js
 * ---------------------------------------------------------------------------
 * 모든 페이지가 공유하는 껍데기 — 상단바와 푸터.
 *
 * 페이지가 5장이라 상단바 마크업을 파일마다 복사해 두면 목차를 한 번 고칠 때
 * 5곳을 고쳐야 한다. 그래서 상단바와 푸터는 js/data/site.js의 NAV 하나로
 * 여기서 만든다. HTML 쪽에는 빈 <header> · <footer> 껍데기만 둔다.
 *
 * 상단바 구조
 *   항목(제품 · 검증 · 기술 · 브랜드 · 팀)은 그 페이지로 가는 링크이면서,
 *   동시에 전체 목차를 여는 트리거다.
 *     · 데스크톱 : 어느 항목에든 닿으면 화면 폭을 다 쓰는 패널 하나가 내려오고,
 *                 다섯 페이지의 상세 목차가 각 항목 바로 아래 열로 정렬된다.
 *                 (항목마다 따로 열리는 작은 패널이 아니라 한 판이다)
 *     · 모바일   : 햄버거 → 시트 안에서 아코디언으로 펼쳐진다
 *   현재 보고 있는 페이지의 항목에는 밑줄이 남고,
 *   그 페이지 안에서 스크롤하면 목차의 현재 섹션에 점이 붙는다.
 *
 *   열을 항목 아래에 정확히 맞추려고 --mega-left / --mega-right 두 값을
 *   실측해서 넣는다. 링크 묶음의 위치는 로고·버튼 폭에 따라 달라지므로
 *   CSS 만으로는 맞출 수 없다.
 */

import { NAV, LINKS, HOME_FILE, SITE } from "../data/site.js";
import { icon } from "../data/icons.js";
import { $, $$, el, escapeHtml } from "./utils.js";

/** 지금 어느 페이지인가 — <body data-page="..."> 값 */
function currentPage() {
  return document.body.dataset.page || "home";
}

/** 같은 페이지 안의 섹션이면 "#id", 다른 페이지면 "file.html#id" */
function hrefFor(pageId, hash) {
  const page = NAV.find((item) => item.id === pageId);
  if (!page) return hash ? `#${hash}` : HOME_FILE;
  if (pageId === currentPage()) return hash ? `#${hash}` : "#top";
  return hash ? `${page.file}#${hash}` : page.file;
}

/* --------------------------------------------------------------------------
   상단바
   -------------------------------------------------------------------------- */

/** 메가패널 한 열 — 페이지 하나의 상세 목차 */
function megaColumn(page, active) {
  const items = page.children
    .map(
      (child) => `
        <a class="nav-mega__item" href="${escapeHtml(hrefFor(page.id, child.hash))}"
           data-section="${escapeHtml(child.hash)}" data-section-page="${escapeHtml(page.id)}">
          ${escapeHtml(child.label)}
        </a>`
    )
    .join("");

  return el("div", {
    className: `nav-mega__col${active ? " is-current" : ""}`,
    attrs: { "data-mega-col": page.id },
    // 열이 항목 바로 아래에 서므로 제목을 다시 적지 않는다
    html: `<div class="nav-mega__items">${items}</div>`,
  });
}

/** 메가패널 — 화면 폭을 다 쓰는 한 판. 다섯 열이 항목 아래에 맞춰 선다. */
function megaPanel(page) {
  return el("div", {
    className: "nav-mega",
    attrs: { id: "nav-mega", hidden: true },
    children: [
      el("div", {
        className: "nav-mega__cols",
        style: { "--mega-count": String(NAV.length) },
        children: NAV.map((item) => megaColumn(item, item.id === page)),
      }),
    ],
  });
}

/** 상단바 항목 하나 — 그 페이지로 가는 링크이면서 메가패널 트리거 */
function navItem(page, active) {
  return el("a", {
    className: `nav-item__link${active ? " is-active" : ""}`,
    attrs: {
      href: hrefFor(page.id),
      "data-nav-item": page.id,
      "aria-expanded": "false",
      "aria-controls": "nav-mega",
    },
    html: `<span>${escapeHtml(page.label)}</span>`,
  });
}

/** 모바일 시트 — 페이지마다 아코디언 한 칸 */
function sheetGroup(page, active) {
  const items = page.children
    .map(
      (child) => `
        <a class="nav-sheet__sub" href="${escapeHtml(hrefFor(page.id, child.hash))}"
           data-section="${escapeHtml(child.hash)}" data-section-page="${escapeHtml(page.id)}">
          ${escapeHtml(child.label)}
        </a>`
    )
    .join("");

  return el("div", {
    className: `nav-sheet__group${active ? " is-current" : ""}`,
    html: `
      <div class="nav-sheet__row">
        <a class="nav-sheet__link" href="${escapeHtml(hrefFor(page.id))}">${escapeHtml(page.label)}</a>
        <button class="nav-sheet__toggle" type="button"
                aria-expanded="${active}" aria-label="${escapeHtml(page.label)} 상세 목차 열기">
          ${icon("chevronDown", 18)}
        </button>
      </div>
      <div class="nav-sheet__subs"${active ? "" : " hidden"}>${items}</div>
    `,
  });
}

function renderNav() {
  const nav = $(".site-nav");
  if (!nav) return null;

  const page = currentPage();

  nav.innerHTML = `
    <div class="nav-shell">
      <a class="nav-brand" href="${escapeHtml(page === "home" ? "#top" : HOME_FILE)}" aria-label="Emour 홈으로">
        <img class="nav-brand__word" src="assets/logo-wordmark.svg" alt="Emour">
        <span class="nav-brand__meaning">${escapeHtml(SITE.meaning)}</span>
      </a>

      <nav class="nav-links" aria-label="페이지 목차"></nav>

      <div class="nav-actions">
        <a class="btn btn--ghost" data-link="repository" href="#" hidden>GitHub</a>
        ${
          /*
           * 주 행동 버튼.
           * 서버를 상시로 열어 둘 수 없으므로, LINKS.service가 비어 있으면
           * "체험하기"를 내걸지 않는다. 대신 언제나 볼 수 있는 소개 영상으로 보낸다.
           * 나중에 서비스 주소가 생기면 js/data/site.js의 LINKS.service만 채우면
           * 이 버튼이 자동으로 "서비스 체험하기"로 바뀐다.
           */
          LINKS.service
            ? `<a class="btn btn--solid" data-link="service" href="#">서비스 체험하기</a>`
            : `<a class="btn btn--solid" href="${escapeHtml(page === "home" ? "#film" : `${HOME_FILE}#film`)}">소개 영상 보기</a>`
        }
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet" aria-label="메뉴 열기">
          <span class="nav-toggle__bars"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  `;

  const linksBox = $(".nav-links", nav);
  linksBox.style.setProperty("--nav-count", String(NAV.length));
  NAV.forEach((item) => linksBox.append(navItem(item, item.id === page)));

  // 메가패널은 상단바 안, 링크 묶음 아래에 놓인다
  nav.append(megaPanel(page));

  /* 열을 항목 아래에 정확히 세운다.
     링크 묶음의 좌표는 로고 · 오른쪽 버튼 폭에 따라 달라져 CSS 로는 알 수 없다. */
  const alignMega = () => {
    const shell = $(".nav-shell", nav);
    if (!shell) return;
    const a = linksBox.getBoundingClientRect();
    const b = shell.getBoundingClientRect();
    nav.style.setProperty("--mega-left", `${Math.round(a.left - b.left)}px`);
    nav.style.setProperty("--mega-right", `${Math.round(b.right - a.right)}px`);
  };
  alignMega();
  window.addEventListener("resize", alignMega);
  // 서체가 늦게 오면 링크 폭이 바뀌므로 한 번 더 맞춘다
  document.fonts?.ready.then(alignMega).catch(() => {});

  // 모바일 시트는 상단바 바깥에 둔다 (상단바가 overflow를 자르기 때문)
  const sheet = el("nav", {
    className: "nav-sheet",
    attrs: { id: "nav-sheet", "aria-label": "모바일 목차" },
  });
  NAV.forEach((item) => sheet.append(sheetGroup(item, item.id === page)));
  nav.after(sheet);

  return nav;
}

/* --------------------------------------------------------------------------
   푸터
   -------------------------------------------------------------------------- */
function renderFooter() {
  const footer = $(".site-footer");
  if (!footer) return;

  /* 페이지마다 한 칸. 상단바 메가패널과 같은 목차를 쓴다 (출처는 NAV 하나) */
  const groups = NAV.map((page) => {
    const items = page.children
      .map(
        (child) =>
          `<li><a href="${escapeHtml(hrefFor(page.id, child.hash))}">${escapeHtml(child.label)}</a></li>`
      )
      .join("");

    return `
      <div>
        <p class="footer-links__title">
          <a href="${escapeHtml(hrefFor(page.id))}">${escapeHtml(page.label)}</a>
        </p>
        <ul>${items}</ul>
      </div>`;
  }).join("");


  footer.innerHTML = `
    <div class="shell shell--wide">
      <div class="footer-top">
        <div>
          <img class="footer-word" src="assets/logo-wordmark.svg" alt="Emour">
          <p class="footer-tagline">
            ${escapeHtml(SITE.meaning)}.<br>
            커플의 대화를 AI로 분석해 감정을 보여주고,
            지나간 대화를 둘의 기록으로 되돌려 주는 모바일 웹 서비스입니다.
          </p>
        </div>
        <div class="footer-links">${groups}</div>
      </div>

      <div class="footer-bottom">
        <span>© ${SITE.year} ${escapeHtml(SITE.name)}. All rights reserved.</span>
        <span>아이콘 · lucide (ISC License) © Lucide Contributors</span>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   외부 링크
   LINKS에 값이 없는 버튼은 눌러도 아무 일이 없으므로 감춘다.
   (주소를 채우면 자동으로 다시 나타난다)
   -------------------------------------------------------------------------- */
export function applyExternalLinks(root = document) {
  $$("[data-link]", root).forEach((node) => {
    const href = LINKS[node.dataset.link];
    if (href) {
      node.setAttribute("href", href);
      node.removeAttribute("hidden");
      if (/^https?:/.test(href)) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    } else {
      // 주소가 없으면 화면에서 제외한다 (레이아웃 흔들림 없음)
      node.setAttribute("hidden", "");
    }
  });
}

/* --------------------------------------------------------------------------
   메가패널 동작

   항목마다 따로 열리는 패널이 아니라 한 판이므로, 여닫는 상태도 하나다.
   상단바 전체에서 포인터가 빠질 때 닫는다 — 항목과 패널 사이를 지나갈 때
   깜빡이지 않도록 유예를 둔다.
   -------------------------------------------------------------------------- */
function initMega(nav) {
  const mega = $(".nav-mega", nav);
  const links = $$(".nav-item__link", nav);
  if (!mega || !links.length) return () => {};

  let closeTimer = null;

  const close = () => {
    clearTimeout(closeTimer);
    nav.classList.remove("is-mega-open");
    mega.setAttribute("hidden", "");
    links.forEach((link) => {
      link.setAttribute("aria-expanded", "false");
      link.classList.remove("is-hot");
    });
    $$(".nav-mega__col", mega).forEach((col) => col.classList.remove("is-hot"));
  };

  /** 패널을 열고, 지금 가리키는 항목의 열을 강조한다 */
  const open = (id) => {
    clearTimeout(closeTimer);
    nav.classList.add("is-mega-open");
    mega.removeAttribute("hidden");
    links.forEach((link) => {
      const on = link.dataset.navItem === id;
      link.setAttribute("aria-expanded", String(on));
      link.classList.toggle("is-hot", on);
    });
    $$(".nav-mega__col", mega).forEach((col) => {
      col.classList.toggle("is-hot", col.dataset.megaCol === id);
    });
  };

  links.forEach((link) => {
    link.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      open(link.dataset.navItem);
    });

    // 탭 이동으로 항목에 닿으면 펼친다
    link.addEventListener("focus", () => open(link.dataset.navItem));

    // ↓ 로 그 항목의 열 첫 링크로 들어간다
    link.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      open(link.dataset.navItem);
      $(`[data-mega-col="${link.dataset.navItem}"] .nav-mega__item`, mega)?.focus();
    });
  });

  // 패널 위에 있는 동안은 열어 둔다
  mega.addEventListener("pointerenter", () => clearTimeout(closeTimer));

  // 상단바(항목 + 패널) 밖으로 나가면 닫는다
  nav.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch") return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 160);
  });

  // 포커스가 상단바 밖으로 빠지면 닫는다
  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("is-mega-open")) return;
    const hot = links.find((link) => link.classList.contains("is-hot"));
    close();
    hot?.focus();
  });

  return close;
}

/* --------------------------------------------------------------------------
   모바일 시트
   -------------------------------------------------------------------------- */
function initSheet(nav) {
  const sheet = $(".nav-sheet");
  const toggle = $(".nav-toggle", nav);
  if (!sheet || !toggle) return;

  const close = () => {
    sheet.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) {
      close();
      return;
    }
    sheet.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
  });

  // 아코디언
  sheet.addEventListener("click", (event) => {
    const accordion = event.target.closest(".nav-sheet__toggle");
    if (accordion) {
      const group = accordion.closest(".nav-sheet__group");
      const subs = $(".nav-sheet__subs", group);
      const open = accordion.getAttribute("aria-expanded") === "true";
      accordion.setAttribute("aria-expanded", String(!open));
      if (subs) subs.hidden = open;
      return;
    }
    // 링크를 누르면 시트를 닫는다
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  // 데스크톱 폭으로 넓어지면 시트를 정리한다
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

/* --------------------------------------------------------------------------
   스크롤 상태 — 유리 효과 · 진행바 · 현재 섹션 표시
   -------------------------------------------------------------------------- */
/** 맨 위로 — 스크롤을 좀 내려가면 우측 하단에 나타난다 */
function initToTop() {
  const button = el("button", {
    className: "to-top",
    attrs: { type: "button", "aria-label": "맨 위로" },
    html: icon("chevronDown", 18),
  });
  button.addEventListener("click", () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });
  document.body.append(button);
  return button;
}

function initScrollState(nav) {
  const progress = $(".scroll-progress");
  const toTop = initToTop();
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle("is-stuck", y > 12);

      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty("--progress", max > 0 ? String(y / max) : "0");
      }

      toTop.classList.toggle("is-on", y > window.innerHeight * 0.9);

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 현재 페이지 안의 섹션 표시 —
     화면 세로 가운데를 지나는 섹션을 "현재"로 본다.
     (rootMargin으로 위아래를 -50% 씩 잘라 가운데 한 줄만 남긴다) */
  const page = currentPage();
  const marks = $$(`[data-section-page="${page}"]`);
  if (!marks.length || !("IntersectionObserver" in window)) return;

  const sections = marks
    .map((mark) => document.getElementById(mark.dataset.section))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        marks.forEach((mark) => {
          mark.classList.toggle("is-current", mark.dataset.section === entry.target.id);
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   같은 페이지 안의 앵커는 부드럽게 이동
   고정 상단바 높이를 빼야 섹션 제목이 가리지 않는다.
   -------------------------------------------------------------------------- */
function initSmoothAnchors(nav, closeDropdowns) {
  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return false;
    const top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 14);
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    return true;
  };

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href*="#"]');
    if (!anchor) return;

    const url = new URL(anchor.href, window.location.href);
    // 다른 파일로 가는 링크는 브라우저에 그대로 맡긴다
    if (url.pathname !== window.location.pathname) return;

    const id = url.hash.slice(1);
    if (!id) return;

    if (scrollToId(id)) {
      event.preventDefault();
      closeDropdowns?.();
      history.replaceState(null, "", `#${id}`);
    }
  });

  // 다른 페이지에서 #섹션 으로 들어왔을 때도 상단바 높이를 보정한다
  if (window.location.hash.length > 1) {
    const id = window.location.hash.slice(1);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      window.scrollTo({
        top: Math.max(target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 14), 0),
        behavior: "auto",
      });
    });
  }
}

/* --------------------------------------------------------------------------
   진입점
   -------------------------------------------------------------------------- */
export function initChrome() {
  const nav = renderNav();
  renderFooter();
  applyExternalLinks();

  if (!nav) return;

  const closeDropdowns = initMega(nav);
  initSheet(nav);
  initScrollState(nav);
  initSmoothAnchors(nav, closeDropdowns);
}
