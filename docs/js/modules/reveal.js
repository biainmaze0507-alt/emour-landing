/**
 * js/modules/reveal.js
 * ---------------------------------------------------------------------------
 * 스크롤 등장 연출과 커서 글로우.
 *
 * 등장 연출은 [data-reveal] 하나로 통일한다.
 *   <div data-reveal>            아래에서 위로
 *   <div data-reveal="left">     왼쪽에서
 *   <div data-reveal="scale">    살짝 커지며
 *   <div data-reveal-group>      자식들에게 순서대로 지연을 준다
 *
 * 한 번 나타난 요소는 다시 감추지 않는다.
 * (스크롤을 되돌릴 때마다 사라졌다 나타나면 읽기가 불편하다)
 */

import { $$, prefersReducedMotion, hasFinePointer, clamp } from "./utils.js";

/** 자식들에게 --delay를 순서대로 넣는다. */
function stagger(group, stepMs = 90, maxSteps = 8) {
  const items = $$("[data-reveal]", group);
  items.forEach((item, index) => {
    // 항목이 아주 많을 때 마지막 요소가 너무 늦게 나오지 않도록 상한을 둔다
    const step = Math.min(index, maxSteps);
    item.style.setProperty("--delay", `${step * stepMs}ms`);
  });
}

export function initReveal() {
  // 그룹 지연 먼저 계산
  $$("[data-reveal-group]").forEach((group) => {
    stagger(group, Number(group.dataset.revealGroup) || 90);
  });

  const targets = $$("[data-reveal]");

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((node) => node.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    {
      // 화면 아래쪽 12% 지점에 닿으면 시작 — 너무 늦게 나타나 보이지 않게
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    }
  );

  targets.forEach((node) => observer.observe(node));

  /* 나중에 JS로 추가된 요소도 관찰 대상에 넣을 수 있게 열어 둔다 */
  window.__emourObserveReveal = (node) => {
    $$("[data-reveal]", node).forEach((child) => observer.observe(child));
    if (node.matches?.("[data-reveal]")) observer.observe(node);
  };
}

/**
 * 커서를 따라다니는 로즈 글로우.
 * 터치 기기 · 모션 최소화 사용자에게는 아예 만들지 않는다.
 */
export function initCursorGlow() {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.append(glow);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let running = false;

  const loop = () => {
    // 목표 지점으로 매 프레임 12% 씩 다가간다 → 부드럽게 끌려오는 느낌
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.setProperty("--mx", `${currentX}px`);
    glow.style.setProperty("--my", `${currentY}px`);

    // 충분히 가까워지면 프레임 루프를 멈춘다(마우스가 멈춰 있을 때 CPU 절약)
    if (Math.abs(targetX - currentX) < 0.4 && Math.abs(targetY - currentY) < 0.4) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      targetX = clamp(event.clientX, 0, window.innerWidth);
      targetY = clamp(event.clientY, 0, window.innerHeight);
      glow.classList.add("is-visible");
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => glow.classList.remove("is-visible"));
}

