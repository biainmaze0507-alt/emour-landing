/**
 * js/modules/utils.js
 * ---------------------------------------------------------------------------
 * 모든 모듈이 공유하는 작은 도구들. 외부 라이브러리는 쓰지 않는다.
 */

/** querySelector 짧은 이름 */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/** querySelectorAll → 진짜 배열 */
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * 요소를 만든다.
 * @param {string} tag
 * @param {object} [props]  className / html / text / attrs / style / on
 * @returns {HTMLElement}
 *
 * 예) el("button", { className: "btn", text: "보기", on: { click: fn } })
 */
export function el(tag, props = {}) {
  const node = document.createElement(tag);
  const { className, html, text, attrs, style, on, children } = props;

  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  if (text != null) node.textContent = text;

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      node.setAttribute(key, value === true ? "" : String(value));
    }
  }

  if (style) {
    for (const [key, value] of Object.entries(style)) {
      node.style.setProperty(key, String(value));
    }
  }

  if (on) {
    for (const [type, handler] of Object.entries(on)) {
      node.addEventListener(type, handler);
    }
  }

  if (children) {
    for (const child of [].concat(children)) {
      if (child) node.append(child);
    }
  }

  return node;
}

/** innerHTML 에 사용자 문자열을 넣기 전에 반드시 통과시킨다. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 이름의 앞 두 글자(한글은 성 제외한 이름) — 아바타 모노그램용 */
export function initials(name) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return "?";
  // 한글 이름은 성을 뺀 나머지가 더 알아보기 쉽다 (황민희 → 민희)
  if (/^[가-힣]{2,4}$/.test(trimmed)) return trimmed.slice(1);
  return trimmed.slice(0, 2).toUpperCase();
}

/** 값을 [min, max] 안으로 자른다. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** ms 만큼 기다린다. */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 사용자가 모션 최소화를 요청했는지 */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 마우스 등 정밀 포인터가 있는 기기인지 (커서 글로우 판단용) */
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * 요소가 화면에 처음 들어올 때 한 번만 실행한다.
 * 카운트업 · 게이지 채우기처럼 "보일 때 시작해야 하는" 연출에 쓴다.
 */
export function onceInView(target, callback, { threshold = 0.35, rootMargin = "0px" } = {}) {
  if (!target) return;

  if (!("IntersectionObserver" in window)) {
    callback(target);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        callback(entry.target);
      }
    },
    { threshold, rootMargin }
  );

  observer.observe(target);
}

/* --------------------------------------------------------------------------
   색 계산 — WCAG 명도 대비
   "로고 색은 왜 버튼에 못 쓰는가"를 화면에서 직접 계산해 보여주기 위해 둔다.
   -------------------------------------------------------------------------- */

/** "#RRGGBB" → [r, g, b] (0~255) */
export function hexToRgb(hex) {
  const clean = String(hex).replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** 상대 휘도 (WCAG 2.x) */
export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 두 색의 명도 대비. 1(같은 색) ~ 21(검정 대 흰색).
 * 본문 크기 글자의 AA 기준은 4.5:1 이다.
 */
export function contrastRatio(hexA, hexB) {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** 대비값 → 등급 문자열 */
export function contrastGrade(ratio) {
  if (ratio >= 7) return { label: "AAA", pass: true };
  if (ratio >= 4.5) return { label: "AA", pass: true };
  if (ratio >= 3) return { label: "AA Large", pass: false };
  return { label: "미달", pass: false };
}

/* --------------------------------------------------------------------------
   숫자 연출
   -------------------------------------------------------------------------- */

/**
 * 0 에서 target 까지 세어 올린다.
 * @param {HTMLElement} node   숫자를 표시할 요소
 * @param {number} target      목표 값
 * @param {object} [options]   duration(ms) / decimals(소수 자리) / prefix / suffix
 */
export function countUp(node, target, { duration = 1500, decimals = 0, prefix = "", suffix = "" } = {}) {
  if (!node) return;

  const format = (value) =>
    `${prefix}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`;

  if (prefersReducedMotion()) {
    node.textContent = format(target);
    return;
  }

  const start = performance.now();

  const step = (now) => {
    const progress = clamp((now - start) / duration, 0, 1);
    // easeOutExpo — 처음엔 빠르게, 끝에서 부드럽게 멈춘다
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    node.textContent = format(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
