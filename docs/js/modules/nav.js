/**
 * js/modules/nav.js
 * ---------------------------------------------------------------------------
 * 상단바 — 목차 렌더 / 스크롤 시 유리 효과 / 현재 섹션 표시 / 모바일 시트 /
 * 스크롤 진행바 / 외부 링크 자동 활성화.
 */

import { NAV_ITEMS, LINKS } from "../data/site.js";
import { $, $$, el, escapeHtml } from "./utils.js";

/** 목차 링크 하나를 만든다. */
function navLink(item, className) {
  return el("a", {
    className,
    text: item.label,
    attrs: { href: `#${item.id}`, "data-nav": item.id },
  });
}

/**
 * LINKS 에 값이 없는 버튼은 눌러도 아무 일이 없으므로 감춘다.
 * (주소를 채우면 자동으로 다시 나타난다)
 * @param {HTMLElement} root
 */
function applyExternalLinks(root = document) {
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

export function initNav() {
  const nav = $(".site-nav");
  const linksBox = $(".nav-links");
  const sheet = $(".nav-sheet");
  const toggle = $(".nav-toggle");
  const progress = $(".scroll-progress");

  if (!nav) return;

  /* ── 1. 목차 렌더 ────────────────────────────────────────────── */
  NAV_ITEMS.forEach((item) => {
    linksBox?.append(navLink(item, "nav-links__item"));
    sheet?.append(navLink(item, "nav-sheet__item"));
  });

  applyExternalLinks();

  /* ── 2. 모바일 시트 ──────────────────────────────────────────── */
  const closeSheet = () => {
    sheet?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) {
      closeSheet();
    } else {
      sheet?.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");
    }
  });

  // 시트 안의 링크를 누르면 닫는다
  sheet?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeSheet();
  });

  // Esc 로도 닫힌다
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
  });

  // 데스크톱 폭으로 넓어지면 시트를 정리한다
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeSheet();
  });

  /* ── 3. 스크롤 상태 (유리 효과 + 진행바) ─────────────────────── */
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

  /* ── 4. 현재 섹션 표시 ───────────────────────────────────────
     화면 세로 가운데를 지나는 섹션을 "현재"로 본다.
     (rootMargin 으로 위아래를 -50% 씩 잘라 가운데 한 줄만 남긴다)
     ------------------------------------------------------------ */
  const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const markActive = (id) => {
      $$("[data-nav]").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.nav === id);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) markActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ── 5. 목차 클릭 시 부드럽게 이동 ───────────────────────────
     CSS scroll-behavior 로도 되지만, 고정 상단바 높이를 빼야 제목이 가리지 않는다.
     (scroll-padding-top 을 쓰지만 일부 브라우저에서 앵커 점프가 남아 보정한다)
     ------------------------------------------------------------ */
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute("href").slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 12);
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${escapeHtml(id)}`);
  });
}

export { applyExternalLinks };
