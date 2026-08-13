/**
 * js/modules/heroChat.js
 * ---------------------------------------------------------------------------
 * 히어로의 살아 있는 대화 창.
 *
 * 앱의 ChatRoomPage 를 그대로 옮긴 구조다 — 상단바 · 대화 로그 ·
 * 문장 다듬기 추천 · 입력창. 목업 프레임(폰 껍데기)은 두르지 않고
 * 윤곽선 하나로만 감싼다.
 *
 * 재생 순서 (HERO_SCRIPT 한 줄마다)
 *   1. 말풍선이 빈 채로 나타난다
 *   2. 글자가 한 자씩 타이핑된다 (내 메시지만)
 *   3. "AI 감정 분석 중" 꼬리표가 잠깐 돌고
 *   4. 감정 태그가 툭 나타난다
 *   5. 마지막에 추천 칩이 올라온다 → 잠시 후 처음부터 반복
 *
 * 화면 밖으로 나가면 재생을 멈춘다(보이지 않는 곳에서 타이머가 도는 걸 막는다).
 * 모션 최소화 사용자에게는 애니메이션 없이 최종 상태만 한 번에 보여 준다.
 */

import { HERO_SCRIPT } from "../data/site.js";
import { $, el, wait, prefersReducedMotion } from "./utils.js";
import { bubbleRow, emotionTag, analyzingTag, metaColumn, suggestionChips } from "./render.js";

/** 한 글자씩 타이핑한다. 중간에 취소될 수 있어 state 를 확인한다. */
async function typeText(bubble, text, state, speed = 42) {
  const caret = el("i", { className: "chat-window__caret" });
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

  if (!log) return;

  /* ── 모션 최소화: 최종 상태를 한 번에 그리고 끝낸다 ─────────── */
  if (prefersReducedMotion()) {
    HERO_SCRIPT.forEach((step) => {
      if (step.type === "mine" || step.type === "yours") {
        log.append(
          bubbleRow({
            ...step,
            side: step.type,
            read: step.type === "mine",
          })
        );
      }
      if (step.type === "suggest" && suggestBox) {
        suggestBox.append(suggestionChips(step.items));
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

      /* 문장 다듬기 추천 */
      if (step.type === "suggest") {
        suggestBox?.append(suggestionChips(step.items, { stagger: true }));
        continue;
      }

      /* 말풍선 — 내 메시지는 빈 채로 넣고 타이핑한다 */
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

      // 읽음 · 시간 — 타이핑이 끝난 뒤에 채운다
      row.querySelector(".chat-row__meta")?.replaceWith(
        metaColumn({ read: side === "mine", time: step.time })
      );

      // AI 분석 → 감정 태그
      if (step.emotion) {
        const analyzing = analyzingTag();
        row._column.prepend(analyzing);

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
  const card = log.closest(".chat-window") ?? log;

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
