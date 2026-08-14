/**
 * js/shared/utils.js
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
      if (value == null) continue;

      /*
       * ARIA 상태는 반드시 문자열 "true" / "false"로 넣는다.
       * true를 빈 문자열로 바꿔 버리면 aria-selected=""가 되고,
       * 그러면 CSS의 [aria-selected="true"]에 걸리지 않아
       * 선택된 탭·스와치·칩이 선택되지 않은 것처럼 보인다.
       * false도 의미가 있는 값이므로 지우지 않는다.
       */
      if (typeof value === "boolean" && key.startsWith("aria-")) {
        node.setAttribute(key, String(value));
        continue;
      }

      // hidden · disabled처럼 존재만으로 켜지는 속성
      if (value === false) continue;
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

/** innerHTML에 사용자 문자열을 넣기 전에 반드시 통과시킨다. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
   숫자 연출
   -------------------------------------------------------------------------- */

/**
 * 0에서 target까지 세어 올린다.
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

/** 소수 자리 수를 값에서 추론한다 (4.56 → 2, 291 → 0). countUp의 decimals에 넣는다. */
export function decimalsOf(value) {
  const text = String(value);
  return text.includes(".") ? text.split(".")[1].length : 0;
}
