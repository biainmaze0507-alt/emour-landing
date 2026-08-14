/**
 * js/pages/proof/feedbackCards.js
 * ---------------------------------------------------------------------------
 * 1차 테스트 피드백 카드(누르면 의견 → 개선으로 뒤집힘)와 2차 사용 후기.
 *
 * 카드는 <button aria-pressed> 로 만든다. 토글이라는 사실이
 * 스크린리더에도 그대로 전달되고, 키보드로도 눌린다.
 */

import { FEEDBACK_CARDS, VOICES } from "./feedback.data.js";
import { icon } from "../../data/icons.js";
import { $, $$, el, escapeHtml } from "../../shared/utils.js";

function feedbackCard(item) {
  return el("button", {
    className: "fb-card",
    attrs: {
      type: "button",
      "aria-pressed": "false",
      "aria-label": `사용자 의견: ${item.issue}. 누르면 개선 방향을 봅니다.`,
    },
    html: `
      <span class="fb-card__face fb-card__face--issue">
        <span class="fb-card__kicker">사용자 의견</span>
        <span class="fb-card__text">${escapeHtml(item.issue)}</span>
        <span class="fb-card__where">${escapeHtml(item.where)}</span>
      </span>
      <span class="fb-card__face fb-card__face--fix">
        <span class="fb-card__kicker">개선 방향</span>
        <span class="fb-card__text">${escapeHtml(item.fix)}</span>
        <span class="fb-card__where">2차 배포에 반영</span>
      </span>
      <span class="fb-card__flip">${icon("rotate", 13)}</span>
    `,
  });
}

export function initFeedback() {
  /* ── 1. 피드백 카드 ────────────────────────────────────────── */
  const grid = $(".feedback__grid");

  if (grid) {
    FEEDBACK_CARDS.forEach((item) => grid.append(feedbackCard(item)));

    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".fb-card");
      if (!card) return;
      const pressed = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!pressed));
    });
  }

  /* ── 2. "모두 뒤집기" 버튼 ─────────────────────────────────── */
  const flipAll = $("[data-flip-all]");

  flipAll?.addEventListener("click", () => {
    const cards = $$(".fb-card", grid);
    // 하나라도 앞면이면 전부 뒤집고, 전부 뒷면이면 전부 되돌린다
    const anyFront = cards.some((card) => card.getAttribute("aria-pressed") !== "true");
    cards.forEach((card, index) => {
      // 순서대로 살짝 늦게 뒤집혀야 "쓸어 넘기는" 느낌이 난다
      setTimeout(() => card.setAttribute("aria-pressed", String(anyFront)), index * 55);
    });
    flipAll.textContent = anyFront ? "원래대로 되돌리기" : "개선 방향 모두 보기";
  });

  /* ── 3. 2차 사용 후기 ──────────────────────────────────────── */
  const voiceHost = $(".feedback__voice-list");

  if (voiceHost) {
    VOICES.forEach((voice) => {
      voiceHost.append(
        el("div", {
          className: `feedback__voice feedback__voice--${voice.side}`,
          attrs: { "data-reveal": voice.side === "right" ? "right" : "left" },
          html: `
            <blockquote class="quote quote--${voice.side}">
              ${escapeHtml(voice.text)}
              <cite class="quote__by">${escapeHtml(voice.by)}</cite>
            </blockquote>
          `,
        })
      );
    });

    window.__emourObserveReveal?.(voiceHost);
  }
}
