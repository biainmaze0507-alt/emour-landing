/**
 * js/modules/chrome.js
 * ---------------------------------------------------------------------------
 * 모든 페이지가 공유하는 껍데기 — 상단바와 푸터.
 *
 * 페이지가 5장이라 상단바 마크업을 파일마다 복사해 두면 목차를 한 번 고칠 때
 * 5곳을 고쳐야 한다. 그래서 상단바와 푸터는 js/data/site.js 의 NAV 하나로
 * 여기서 만든다. HTML 쪽에는 빈 <header> · <footer> 껍데기만 둔다.
 *
 * 상단바 구조
 *   항목(제품 · 검증 · 기술 · 브랜드 · 팀)은 그 페이지로 가는 링크이면서,
 *   동시에 그 페이지의 상세 목차를 여는 트리거다.
 *     · 데스크톱 : 올리거나 탭 포커스가 닿으면 패널이 펼쳐진다
 *     · 모바일   : 햄버거 → 시트 안에서 아코디언으로 펼쳐진다
 *   현재 보고 있는 페이지의 항목에는 밑줄이 남고,
 *   그 페이지 안에서 스크롤하면 패널 안의 현재 섹션에 점이 붙는다.
 */

import { NAV, LINKS, HOME_FILE, FOOTER_GROUPS, SITE } from "../data/site.js";
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

/** 드롭다운 패널 — 페이지 소개 + 그 페이지의 섹션 목록 */
function navPanel(page) {
  const items = page.children
    .map(
      (child) => `
        <a class="nav-panel__item" href="${escapeHtml(hrefFor(page.id, child.hash))}"
           data-section="${escapeHtml(child.hash)}" data-section-page="${escapeHtml(page.id)}">
          <span class="nav-panel__item-label">${escapeHtml(child.label)}</span>
          <span class="nav-panel__item-desc">${escapeHtml(child.desc)}</span>
        </a>`
    )
    .join("");

  return el("div", {
    className: "nav-panel",
    attrs: { id: `nav-panel-${page.id}`, hidden: true },
    html: `
      <div class="nav-panel__inner">
        <div class="nav-panel__lead">
          <p class="nav-panel__lead-title">${escapeHtml(page.label)}</p>
          <p class="nav-panel__lead-desc">${escapeHtml(page.summary)}</p>
          <a class="nav-panel__lead-link" href="${escapeHtml(hrefFor(page.id))}">
            페이지 전체 보기 ${icon("arrowRight", 14)}
          </a>
        </div>
        <div class="nav-panel__list">${items}</div>
      </div>
    `,
  });
}

/** 상단바 항목 하나 = 링크 + 패널 */
function navItem(page, active) {
  const group = el("div", { className: "nav-item", attrs: { "data-nav-item": page.id } });

  const link = el("a", {
    className: `nav-item__link${active ? " is-active" : ""}`,
    attrs: {
      href: hrefFor(page.id),
      "aria-expanded": "false",
      "aria-controls": `nav-panel-${page.id}`,
    },
    html: `<span>${escapeHtml(page.label)}</span>${icon("chevronDown", 14)}`,
  });

  group.append(link, navPanel(page));
  return group;
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
        <a class="btn btn--solid" data-link="service" href="#" hidden>서비스 체험하기</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet" aria-label="메뉴 열기">
          <span class="nav-toggle__bars"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  `;

  const linksBox = $(".nav-links", nav);
  NAV.forEach((item) => linksBox.append(navItem(item, item.id === page)));

  // 모바일 시트는 상단바 바깥에 둔다 (상단바가 overflow 를 자르기 때문)
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

  const groups = FOOTER_GROUPS.map((group) => {
    const items = group.items
      .map((item) => {
        // href 를 직접 적은 항목은 외부 링크, page 를 적은 항목은 내부 페이지
        const href = item.href ?? hrefFor(item.page, item.hash);
        if (!href) return "";
        const external = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<li><a href="${escapeHtml(href)}"${external}>${escapeHtml(item.label)}</a></li>`;
      })
      .filter(Boolean)
      .join("");

    if (!items) return "";
    return `
      <div>
        <p class="footer-links__title">${escapeHtml(group.title)}</p>
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
            커플의 대화를 AI 로 분석해 감정을 보여주고,
            지나간 대화를 둘의 기록으로 되돌려 주는 모바일 웹 서비스입니다.
          </p>
        </div>
        <div class="footer-links">${groups}</div>
      </div>

      <div class="footer-bottom">
        <span>© ${SITE.year} ${escapeHtml(SITE.team)}. All rights reserved.</span>
        <span>아이콘 · lucide (ISC License) © Lucide Contributors</span>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   외부 링크
   LINKS 에 값이 없는 버튼은 눌러도 아무 일이 없으므로 감춘다.
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
   드롭다운 동작
   -------------------------------------------------------------------------- */
function initDropdowns(nav) {
  const groups = $$(".nav-item", nav);
  let openTimer = null;

  const closeAll = () => {
    groups.forEach((group) => {
      group.classList.remove("is-open");
      $(".nav-item__link", group)?.setAttribute("aria-expanded", "false");
      $(".nav-panel", group)?.setAttribute("hidden", "");
    });
  };

  const open = (group) => {
    if (group.classList.contains("is-open")) return;
    closeAll();
    group.classList.add("is-open");
    $(".nav-item__link", group)?.setAttribute("aria-expanded", "true");
    $(".nav-panel", group)?.removeAttribute("hidden");
  };

  groups.forEach((group) => {
    const link = $(".nav-item__link", group);

    // 올리면 펼치고, 벗어나면 잠깐 뒤 닫는다
    // (항목과 패널 사이를 지나갈 때 깜빡이지 않도록 유예를 둔다)
    group.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      clearTimeout(openTimer);
      open(group);
    });

    group.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      clearTimeout(openTimer);
      openTimer = setTimeout(closeAll, 140);
    });

    // 탭 이동으로 항목에 닿으면 펼친다
    link?.addEventListener("focus", () => open(group));

    // ↓ 로 패널 안 첫 항목으로 들어간다
    link?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      open(group);
      $(".nav-panel__item", group)?.focus();
    });

    // 패널 밖으로 포커스가 빠져나가면 닫는다
    group.addEventListener("focusout", (event) => {
      if (!group.contains(event.relatedTarget)) {
        group.classList.remove("is-open");
        link?.setAttribute("aria-expanded", "false");
        $(".nav-panel", group)?.setAttribute("hidden", "");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openGroup = groups.find((group) => group.classList.contains("is-open"));
    if (!openGroup) return;
    closeAll();
    $(".nav-item__link", openGroup)?.focus();
  });

  return closeAll;
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
function initScrollState(nav) {
  const progress = $(".scroll-progress");
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

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 현재 페이지 안의 섹션 표시 —
     화면 세로 가운데를 지나는 섹션을 "현재"로 본다.
     (rootMargin 으로 위아래를 -50% 씩 잘라 가운데 한 줄만 남긴다) */
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

  const closeDropdowns = initDropdowns(nav);
  initSheet(nav);
  initScrollState(nav);
  initSmoothAnchors(nav, closeDropdowns);
}
