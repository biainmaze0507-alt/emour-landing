/**
 * js/modules/proof.js
 * ---------------------------------------------------------------------------
 * 유저 테스트 · 모델 지표 섹션.
 *   1단 테스트 규모 (카운트업)
 *   2단 만족도 게이지 + 일치율 도넛
 *   3단 답장 추천 화행 일치율
 *   4단 Macro F1 여정
 *
 * 숫자는 화면에 들어올 때 한 번만 세어 올린다.
 */

import { TEST_SCALE, RATINGS, AGREEMENT, SPEECH_ACT, F1_JOURNEY, F1_CLOSING } from "../data/proof.js";
import { HERO_FACTS } from "../data/site.js";
import { $, $$, el, escapeHtml, countUp, onceInView } from "./utils.js";

/** 소수 자리 수를 값에서 추론한다 (4.56 → 2, 291 → 0) */
const decimalsOf = (value) => {
  const text = String(value);
  return text.includes(".") ? text.split(".")[1].length : 0;
};

/* --------------------------------------------------------------------------
   히어로 하단 요약 수치 — 같은 카운트업을 쓰므로 여기서 함께 처리한다
   -------------------------------------------------------------------------- */
export function initHeroFacts() {
  const host = $(".hero__facts");
  if (!host) return;

  HERO_FACTS.forEach((fact) => {
    const value = el("div", { className: "hero__fact-value" });
    const number = el("span", { text: "0" });
    value.append(number, el("span", { text: fact.suffix }));

    const block = el("div", {
      children: [value, el("div", { className: "hero__fact-label", text: fact.label })],
    });

    host.append(block);

    onceInView(block, () =>
      countUp(number, Number(fact.value), { decimals: decimalsOf(fact.value), duration: 1400 })
    );
  });
}

/* --------------------------------------------------------------------------
   본 섹션
   -------------------------------------------------------------------------- */
export function initProof() {
  /* ── 1단. 테스트 규모 ──────────────────────────────────────── */
  const scaleHost = $(".proof__scale");
  if (scaleHost) {
    TEST_SCALE.forEach((item) => {
      const number = el("span", { text: "0" });
      const card = el("div", {
        className: "stat",
        attrs: { "data-reveal": "" },
        children: [
          el("div", {
            className: "stat__value",
            children: [number, el("span", { className: "stat__unit", text: item.unit })],
          }),
          el("div", { className: "stat__label", text: item.label }),
          el("div", { className: "stat__note", text: item.note }),
        ],
      });
      scaleHost.append(card);
      onceInView(card, () => countUp(number, item.value, { duration: 1500 }));
    });
  }

  /* ── 2단-a. 만족도 게이지 ──────────────────────────────────── */
  const ratingHost = $(".proof__ratings");
  if (ratingHost) {
    RATINGS.forEach((rating) => {
      const scoreNode = el("span", { text: "0" });

      const row = el("div", {
        children: [
          el("div", {
            className: "proof__rating-top",
            children: [
              el("span", { className: "proof__rating-name", text: rating.name }),
              el("span", {
                className: "proof__rating-score",
                children: [scoreNode, el("small", { text: ` / ${rating.max}` })],
              }),
            ],
          }),
          el("div", { className: "meter", html: `<div class="meter__fill"></div>` }),
        ],
      });

      ratingHost.append(row);

      onceInView(row, () => {
        countUp(scoreNode, rating.score, {
          decimals: rating.decimals ?? decimalsOf(rating.score),
          duration: 1400,
        });
        const fill = row.querySelector(".meter__fill");
        requestAnimationFrame(() => {
          fill.style.width = `${(rating.score / rating.max) * 100}%`;
        });
      });
    });
  }

  /* ── 2단-b. 일치율 도넛 ────────────────────────────────────
     반지름 54 원의 둘레를 dasharray로 잘라 채운다.
     ---------------------------------------------------------- */
  const donutHost = $(".proof__donut");
  if (donutHost) {
    const RADIUS = 54;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const labelNode = el("span", { text: "0" });

    donutHost.append(
      el("div", {
        html: `
          <svg class="proof__donut-svg" viewBox="0 0 128 128" role="img"
               aria-label="감정 분석 결과가 절반 이상 일치했다는 응답 ${AGREEMENT.percent}%">
            <circle class="proof__donut-track" cx="64" cy="64" r="${RADIUS}"></circle>
            <circle class="proof__donut-value" cx="64" cy="64" r="${RADIUS}"></circle>
          </svg>
        `,
      })
    );

    const label = el("div", { className: "proof__donut-label" });
    label.append(labelNode, el("span", { text: "%" }));

    donutHost.append(
      label,
      el("div", { className: "proof__donut-cap", text: AGREEMENT.caption }),
      el("div", { className: "proof__donut-note", text: AGREEMENT.note })
    );

    onceInView(donutHost, () => {
      countUp(labelNode, AGREEMENT.percent, { decimals: 1, duration: 1500 });
      const arc = donutHost.querySelector(".proof__donut-value");
      const filled = (AGREEMENT.percent / 100) * CIRCUMFERENCE;
      requestAnimationFrame(() => {
        arc.style.strokeDasharray = `${filled} ${CIRCUMFERENCE - filled}`;
      });
    });
  }

  /* ── 3단. 화행 일치율 ──────────────────────────────────────── */
  const speechHost = $(".proof__speech");
  if (speechHost) {
    SPEECH_ACT.forEach((item) => {
      const pctNode = el("span", { text: "0" });

      const row = el("div", {
        className: "proof__speech-row",
        attrs: { "data-reveal": "" },
        children: [
          el("div", {
            className: "proof__speech-kind",
            html: `${escapeHtml(item.kind)}<span>${escapeHtml(item.en)}</span>`,
          }),
          el("div", {
            className: "proof__speech-line",
            html: `“${escapeHtml(item.line)}”<div class="meter"><div class="meter__fill"></div></div>`,
          }),
          el("div", {
            className: "proof__speech-pct",
            children: [pctNode, el("span", { text: "%" })],
          }),
        ],
      });

      speechHost.append(row);

      onceInView(row, () => {
        countUp(pctNode, item.pct, { decimals: 1, duration: 1300 });
        const fill = row.querySelector(".meter__fill");
        requestAnimationFrame(() => {
          fill.style.width = `${item.pct}%`;
        });
      });
    });
  }

  /* ── 4단. Macro F1 여정 ────────────────────────────────────── */
  const f1Host = $(".proof__f1-steps");
  if (f1Host) {
    F1_JOURNEY.forEach((step) => {
      f1Host.append(
        el("div", {
          className: "proof__f1-step",
          attrs: { "data-reveal": "" },
          html: `
            <div class="proof__f1-score">${escapeHtml(step.score)}</div>
            <p class="proof__f1-cond">${escapeHtml(step.condition)}</p>
            <p class="proof__f1-why">${escapeHtml(step.why)}</p>
          `,
        })
      );
    });
  }

  const f1Closing = $(".proof__f1-closing");
  if (f1Closing) f1Closing.textContent = F1_CLOSING;

  // JS로 넣은 [data-reveal] 요소들도 관찰 대상에 등록한다
  $$(".proof__scale, .proof__speech, .proof__f1-steps").forEach((node) => {
    window.__emourObserveReveal?.(node);
  });
}
