/**
 * js/modules/emotionGrid.js
 * ---------------------------------------------------------------------------
 * 감정 15색 섹션.
 *   · 필터 칩(전체 / 긍정 / 중립 / 부정) — 선택하면 나머지가 가라앉는다
 *   · 카드 클릭 → HEX 복사
 *   · 아래로 흐르는 감정 라벨 띠 + 극성 3색 설명 + 오늘의 기분 5단계
 */

import { EMOTIONS, MOODS, POLARITY, countByPolarity } from "../data/emotions.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml } from "./utils.js";

const POLARITY_DESC = {
  POSITIVE: "대화가 잘 흐르고 있다는 신호. 감정 흐름 그래프에서는 기쁨 색으로 묶어 표시합니다.",
  NEUTRAL: "좋다 나쁘다로 나눌 수 없는 상태. 사과 · 궁금함처럼 관계를 잇는 신호가 여기 들어갑니다.",
  NEGATIVE: "지금 살펴봐야 할 신호. 상처 색으로 묶여 흐름 그래프의 아래쪽을 그립니다.",
};

/** 감정 카드 하나 */
function emotionCard(emotion) {
  const polarityLabel = POLARITY[emotion.polarity].label;

  return el("button", {
    className: "emotion-card",
    attrs: {
      type: "button",
      "data-polarity": emotion.polarity,
      "data-hex": emotion.hex,
      "aria-label": `${emotion.label} · ${emotion.code} · ${emotion.hex} — 누르면 HEX 를 복사합니다`,
    },
    style: { "--tone": `var(${emotion.token})` },
    html: `
      <span class="emotion-card__icon">${icon(emotion.icon, 22)}</span>
      <span class="emotion-card__label">${escapeHtml(emotion.label)}</span>
      <span class="emotion-card__code">${escapeHtml(emotion.code)}</span>
      <span class="emotion-card__foot">
        <span class="emotion-card__hex"><i class="emotion-card__swatch"></i>${escapeHtml(emotion.hex)}</span>
        <span class="emotion-card__polarity">${escapeHtml(polarityLabel)}</span>
      </span>
      <span class="emotion-card__copied">복사됨</span>
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

/** 클립보드 복사 — 보안 컨텍스트가 아닐 때를 대비한 대체 경로 포함 */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 대체 경로로 */
  }

  const helper = el("textarea", {
    style: { position: "fixed", top: "-1000px", opacity: "0" },
  });
  helper.value = text;
  document.body.append(helper);
  helper.select();
  const ok = document.execCommand?.("copy") ?? false;
  helper.remove();
  return ok;
}

export function initEmotionGrid() {
  const grid = $(".emotions__grid");
  const filters = $(".emotions__filters");
  const marquee = $(".emotions__marquee .marquee__track");
  const polarityBox = $(".emotions__polarity");
  const moodTrack = $(".mood-scale__track");

  /* ── 1. 필터 칩 ────────────────────────────────────────────── */
  if (filters) {
    filters.append(filterChip("ALL", "전체", EMOTIONS.length));
    Object.values(POLARITY).forEach((p) => {
      filters.append(filterChip(p.key, p.label, countByPolarity(p.key)));
    });
  }

  /* ── 2. 카드 ───────────────────────────────────────────────── */
  if (grid) {
    EMOTIONS.forEach((emotion) => grid.append(emotionCard(emotion)));

    // 클릭 → HEX 복사 (이벤트 위임)
    grid.addEventListener("click", async (event) => {
      const card = event.target.closest(".emotion-card");
      if (!card) return;

      const ok = await copyText(card.dataset.hex);
      if (!ok) return;

      card.classList.add("is-copied");
      clearTimeout(card._copyTimer);
      card._copyTimer = setTimeout(() => card.classList.remove("is-copied"), 1200);
    });
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
      const match = key === "ALL" || card.dataset.polarity === key;
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

  /* ── 5. 극성 3색 설명 ──────────────────────────────────────── */
  if (polarityBox) {
    Object.values(POLARITY).forEach((p) => {
      polarityBox.append(
        el("div", {
          className: "emotions__polarity-item",
          style: { "--tone": `var(${p.token})` },
          html: `
            <b>${escapeHtml(p.label)} · ${escapeHtml(p.key)} ${countByPolarity(p.key)}종</b>
            <p>${escapeHtml(POLARITY_DESC[p.key])}</p>
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
          html: `<b>${escapeHtml(mood.label)}</b><span>${escapeHtml(mood.hex)}</span>`,
        })
      );
    });
  }
}
