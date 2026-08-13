/**
 * js/modules/heroChat.js
 * ---------------------------------------------------------------------------
 * 히어로의 살아 있는 대화 카드.
 *
 * 재생 순서 (HERO_SCRIPT 한 줄마다)
 *   1. 말풍선이 빈 채로 나타난다
 *   2. 글자가 한 자씩 타이핑된다 (내 메시지만)
 *   3. "AI 감정 분석 중" 스피너가 잠깐 돌고
 *   4. 감정 태그가 툭 나타난다
 *   5. 마지막에 답장 추천 3안이 올라온다 → 잠시 후 처음부터 반복
 *
 * 화면 밖으로 나가면 재생을 멈춘다(보이지 않는 곳에서 타이머가 도는 걸 막는다).
 * 모션 최소화 사용자에게는 애니메이션 없이 최종 상태만 한 번에 보여 준다.
 */

import { HERO_SCRIPT } from "../data/site.js";
import { EMOTIONS } from "../data/emotions.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml, wait, prefersReducedMotion } from "./utils.js";
import { bubbleRow, emotionTag } from "./render.js";

/** 배경에 떠다니는 감정 입자 — 15종 중 8개를 골라 흩뿌린다. */
function renderParticles(host) {
  if (!host || prefersReducedMotion()) return;

  // 카드를 가리지 않도록 좌우 가장자리 쪽에 배치한다 (x, y 는 %)
  const spots = [
    { code: "JOY", x: -2, y: 6 },
    { code: "EXCITEMENT", x: 74, y: 0 },
    { code: "COMFORT", x: 86, y: 34 },
    { code: "CURIOSITY", x: -6, y: 40 },
    { code: "GRATITUDE", x: 80, y: 74 },
    { code: "SURPRISE", x: -4, y: 74 },
    { code: "APOLOGY", x: 62, y: 96 },
    { code: "SHYNESS", x: 10, y: 98 },
  ];

  spots.forEach((spot, index) => {
    const emotion = EMOTIONS.find((e) => e.code === spot.code);
    if (!emotion) return;

    host.append(
      el("span", {
        className: "hero__particle",
        html: `${icon(emotion.icon, 12)}<span>${escapeHtml(emotion.label)}</span>`,
        style: {
          "--tone": `var(${emotion.token})`,
          "--dur": `${7 + (index % 4) * 1.6}s`,
          "--delay": `${index * 0.45}s`,
          left: `${spot.x}%`,
          top: `${spot.y}%`,
        },
        attrs: { "aria-hidden": "true" },
      })
    );
  });
}

/** 한 글자씩 타이핑한다. 중간에 취소될 수 있어 token 을 확인한다. */
async function typeText(bubble, text, state, speed = 42) {
  const caret = el("i", { className: "hero-chat__caret" });
  bubble.append(caret);

  for (let i = 0; i < text.length; i += 1) {
    if (state.cancelled) return;
    caret.before(document.createTextNode(text[i]));
    // 문장부호에서 살짝 쉬면 사람이 치는 느낌이 난다
    await wait(/[,.…?!]/.test(text[i]) ? speed * 4 : speed);
  }

  caret.remove();
}

export function initHeroChat() {
  const log = $(".hero-chat__log");
  const suggestBox = $(".hero-chat__suggests");
  const particles = $(".hero__particles");

  if (!log) return;

  renderParticles(particles);

  /* ── 모션 최소화: 최종 상태를 한 번에 그리고 끝낸다 ─────────── */
  if (prefersReducedMotion()) {
    HERO_SCRIPT.forEach((step) => {
      if (step.type === "mine" || step.type === "yours") {
        log.append(bubbleRow({ ...step, side: step.type, time: "오후 10:10", read: step.type === "mine" }));
      }
      if (step.type === "suggest" && suggestBox) {
        step.items.forEach((item) => {
          suggestBox.append(
            el("button", {
              className: "hero-chat__suggest",
              type: "button",
              html: `<b>${escapeHtml(item.kind)}</b><span>${escapeHtml(item.text)}</span>`,
            })
          );
        });
      }
    });
    return;
  }

  /* ── 재생기 ────────────────────────────────────────────────── */
  const state = { cancelled: false, playing: false };

  const reset = () => {
    log.textContent = "";
    if (suggestBox) suggestBox.textContent = "";
  };

  async function play() {
    if (state.playing) return;
    state.playing = true;
    state.cancelled = false;
    reset();

    for (const step of HERO_SCRIPT) {
      if (state.cancelled) break;

      /* 잠깐 멈춤 */
      if (step.type === "wait") {
        await wait(step.ms ?? 600);
        continue;
      }

      /* 답장 추천 3안 */
      if (step.type === "suggest") {
        for (const [index, item] of step.items.entries()) {
          if (state.cancelled) break;
          const card = el("button", {
            className: "hero-chat__suggest",
            type: "button",
            html: `<b>${escapeHtml(item.kind)}</b><span>${escapeHtml(item.text)}</span>`,
            style: { "animation-delay": `${index * 60}ms` },
          });
          suggestBox?.append(card);
          await wait(190);
        }
        continue;
      }

      /* 말풍선 */
      const side = step.type; // "mine" | "yours"
      const row = bubbleRow({ side, text: step.text, empty: side === "mine" });
      log.append(row);

      // 로그가 넘치지 않게 오래된 줄을 정리한다
      while (log.children.length > 4) log.firstElementChild?.remove();

      if (side === "mine") {
        await typeText(row._bubble, step.text, state);
      } else {
        await wait(520);
      }
      if (state.cancelled) break;

      // 시간 · 읽음 표시
      const meta = el("span", { className: "bubble-meta" });
      if (side === "mine") meta.append(el("b", { className: "bubble-meta__read", text: "읽음" }));
      meta.append(el("span", { text: "오후 10:10" }));
      row.append(meta);

      // AI 분석 → 감정 태그
      if (step.emotion) {
        const analyzing = el("span", {
          className: "analyzing",
          html: `<i class="analyzing__spinner"></i><span>AI 감정 분석 중</span>`,
        });
        row.prepend(analyzing);

        await wait(900);
        if (state.cancelled) break;

        analyzing.replaceWith(emotionTag(step.emotion, { pop: true }));
      }

      await wait(420);
    }

    state.playing = false;

    // 취소되지 않았다면 처음부터 다시
    if (!state.cancelled) {
      await wait(900);
      if (!state.cancelled) play();
    }
  }

  /* ── 화면에 보일 때만 재생 ─────────────────────────────────── */
  const card = log.closest(".hero-chat") ?? log;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play();
          } else {
            state.cancelled = true;
            state.playing = false;
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(card);
  } else {
    play();
  }

  // 다른 탭으로 갔을 때도 멈춘다
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      state.cancelled = true;
      state.playing = false;
    } else {
      play();
    }
  });
}
