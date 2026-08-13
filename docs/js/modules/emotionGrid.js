/**
 * js/modules/emotionGrid.js
 * ---------------------------------------------------------------------------
 * 감정 15색 섹션.
 *   · 필터 칩(전체 / 긍정 / 중립 / 부정 / 관계 신호) — 선택하면 나머지가 가라앉는다
 *   · 아래로 흐르는 감정 라벨 띠 + 4분류 설명 + 오늘의 기분 5단계
 */

import { EMOTIONS, MOODS, EMOTION_GROUPS, countByGroup } from "../data/emotions.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml } from "./utils.js";

const GROUP_DESC = {
  POSITIVE: "대화가 잘 흐르고 있다는 신호입니다.",
  NEUTRAL: "좋다 나쁘다로 나눌 수 없는 상태입니다. 대화의 대부분이 여기에 머뭅니다.",
  NEGATIVE: "지금 살펴봐야 할 신호입니다.",
  RELATION: "좋고 나쁨으로 가르기보다, 상대를 향해 건네는 말이라 따로 묶었습니다.",
};

/** 감정 카드 하나 */
function emotionCard(emotion) {
  const groupLabel = EMOTION_GROUPS[emotion.group].label;

  return el("li", {
    className: "emotion-card",
    attrs: { "data-group": emotion.group },
    style: { "--tone": `var(${emotion.token})` },
    html: `
      <span class="emotion-card__head">
        <span class="emotion-card__icon">${icon(emotion.icon, 22)}</span>
        <span>
          <span class="emotion-card__label">${escapeHtml(emotion.label)}</span>
          <span class="emotion-card__code">${escapeHtml(emotion.code)}</span>
        </span>
      </span>
      <span class="emotion-card__foot">
        <span class="emotion-card__group">${escapeHtml(groupLabel)}</span>
      </span>
    `,
  });
}

/** 필터 칩 */
function filterChip(key, label, count) {
  return el("button", {
    className: "chip chip--toggle",
    attrs: { type: "button", "data-filter": key, "aria-pressed": key === "ALL" },
    html: count == null ? escapeHtml(label) : `${escapeHtml(label)} <b>${count}</b>`,
  });
}

export function initEmotionGrid() {
  const grid = $(".emotions__grid");
  const filters = $(".emotions__filters");
  const marquee = $(".emotions__marquee .marquee__track");
  const groupBox = $(".emotions__groups");
  const moodTrack = $(".mood-scale__track");

  /* ── 1. 필터 칩 ────────────────────────────────────────────── */
  if (filters) {
    filters.append(filterChip("ALL", "전체", EMOTIONS.length));
    Object.values(EMOTION_GROUPS).forEach((g) => {
      filters.append(filterChip(g.key, g.label, countByGroup(g.key)));
    });
  }

  /* ── 2. 카드 ───────────────────────────────────────────────── */
  if (grid) {
    EMOTIONS.forEach((emotion) => grid.append(emotionCard(emotion)));
  }

  /* ── 3. 필터 동작 ──────────────────────────────────────────── */
  filters?.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-filter]");
    if (!chip) return;

    const key = chip.dataset.filter;

    filters.querySelectorAll("[data-filter]").forEach((node) => {
      node.setAttribute("aria-pressed", String(node === chip));
    });

    grid?.querySelectorAll(".emotion-card").forEach((card) => {
      const match = key === "ALL" || card.dataset.group === key;
      card.classList.toggle("is-dimmed", !match);
    });
  });

  /* ── 4. 흐르는 라벨 띠 ─────────────────────────────────────
     같은 목록을 두 번 이어 붙여야 -50% 이동이 끊기지 않는다.
     ---------------------------------------------------------- */
  if (marquee) {
    const makeChips = () =>
      EMOTIONS.map((emotion) =>
        el("span", {
          className: "chip",
          style: { "--tone": `var(${emotion.token})` },
          html: `${icon(emotion.icon, 13)}<span>${escapeHtml(emotion.label)}</span>`,
        })
      );

    makeChips().forEach((chip) => marquee.append(chip));
    makeChips().forEach((chip) => {
      chip.setAttribute("aria-hidden", "true");
      marquee.append(chip);
    });
  }

  /* ── 5. 4분류 설명 ─────────────────────────────────────────── */
  if (groupBox) {
    Object.values(EMOTION_GROUPS).forEach((g) => {
      groupBox.append(
        el("div", {
          className: "emotions__group-item",
          style: { "--tone": `var(${g.token})` },
          html: `
            <b>${escapeHtml(g.label)} ${countByGroup(g.key)}종</b>
            <p>${escapeHtml(GROUP_DESC[g.key])}</p>
          `,
        })
      );
    });
  }

  /* ── 6. 오늘의 기분 5단계 ──────────────────────────────────── */
  if (moodTrack) {
    MOODS.forEach((mood) => {
      moodTrack.append(
        el("div", {
          className: "mood-scale__step",
          style: { "--tone": `var(${mood.token})` },
          html: `<b>${escapeHtml(mood.label)}</b>`,
        })
      );
    });
  }
}
