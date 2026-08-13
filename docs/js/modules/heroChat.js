/**
 * js/modules/heroChat.js
 * ---------------------------------------------------------------------------
 * 히어로의 살아 있는 대화 창.
 *
 * 앱의 ChatRoomPage를 그대로 옮긴 구조다 — 상단바 · 대화 로그 ·
 * 문장 다듬기 추천 · 입력창. 목업 프레임(폰 껍데기)은 두르지 않고
 * 윤곽선 하나로만 감싼다.
 *
 * 재생 순서
 *   1. 상대 메시지가 먼저 올라온다
 *   2. 내 메시지는 입력창에 한 글자씩 쳐진다 (보내기 버튼이 켜진다)
 *   3. 다 치면 입력창이 비워지고 그 문장이 말풍선으로 올라간다
 *   4. "AI 감정 분석 중" 꼬리표가 잠깐 돌고 감정 태그가 붙는다
 *   5. 마지막 줄까지 가면 잠시 후 처음부터 반복
 *
 * 창 높이는 처음부터 끝까지 고정이다. 로그 칸의 높이를 CSS로 잡아 두고
 * 넘치는 옛 줄은 위로 밀려 잘린다 — 말풍선이 쌓여도 윤곽선이 흔들리지 않는다.
 *
 * 화면 밖으로 나가면 재생을 멈춘다(보이지 않는 곳에서 타이머가 도는 걸 막는다).
 * 모션 최소화 사용자에게는 애니메이션 없이 최종 상태만 한 번에 보여 준다.
 */

import { HERO_SCRIPT, HERO_SUGGESTS } from "../data/site.js";
import { $, wait, prefersReducedMotion } from "./utils.js";
import { bubbleRow, emotionTag, analyzingTag, metaColumn, suggestionChips } from "./render.js";

const PLACEHOLDER = "메시지를 입력하세요";

/** 로그가 넘치지 않게 오래된 줄을 정리한다 */
function trim(log, max = 4) {
  while (log.children.length > max) log.firstElementChild?.remove();
}

export function initHeroChat() {
  const log = $(".hero-chat__log");
  if (!log) return;

  /* 추천 칩은 한 번만 그린다. 재생 중에 넣고 빼면 창 높이가 흔들린다. */
  const suggestBox = $(".hero-chat__suggests");
  if (suggestBox && !suggestBox.children.length) {
    suggestBox.append(suggestionChips(HERO_SUGGESTS));
  }

  const field = $(".hero-chat__field");
  const input = $(".hero-chat__input");
  const send = $(".hero-chat__send");

  /** 입력창 상태 — 비어 있으면 플레이스홀더, 글자가 있으면 입력 중 */
  const setInput = (text) => {
    if (!input) return;
    input.textContent = text || PLACEHOLDER;
    field?.classList.toggle("is-typing", Boolean(text));
    // 보낼 것이 있을 때만 보내기 버튼에 색이 들어온다 (앱과 같은 규칙)
    send?.classList.toggle("is-ready", Boolean(text));
  };

  /** 입력창에 한 글자씩 쳐 넣는다 */
  async function typeInto(text, state, speed = 46) {
    let typed = "";
    for (const letter of text) {
      if (state.cancelled) return;
      typed += letter;
      setInput(typed);
      // 문장부호에서 살짝 쉬면 사람이 치는 느낌이 난다
      await wait(/[,.…?!]/.test(letter) ? speed * 4 : speed);
    }
  }

  /* ── 모션 최소화: 최종 상태를 한 번에 그리고 끝낸다 ─────────── */
  if (prefersReducedMotion()) {
    HERO_SCRIPT.filter((step) => step.type === "mine" || step.type === "yours").forEach((step) =>
      log.append(bubbleRow({ ...step, side: step.type, read: step.type === "mine" }))
    );
    trim(log);
    setInput("");
    return;
  }

  /* ── 재생기 ────────────────────────────────────────────────── */
  const state = { cancelled: false, playing: false };

  async function play() {
    if (state.playing) return;
    state.playing = true;
    state.cancelled = false;

    log.textContent = "";
    setInput("");

    for (const step of HERO_SCRIPT) {
      if (state.cancelled) break;

      if (step.type === "wait") {
        await wait(step.ms ?? 600);
        continue;
      }

      /* 내 메시지 — 입력창에 치고 나서 보낸다 */
      if (step.type === "mine") {
        await typeInto(step.text, state);
        if (state.cancelled) break;

        await wait(340);
        if (state.cancelled) break;
        setInput("");
      }

      /* 말풍선으로 올린다 */
      const row = bubbleRow({ side: step.type, text: step.text });
      log.append(row);
      trim(log);

      if (step.type === "yours") await wait(320);
      if (state.cancelled) break;

      // 읽음 · 시간
      row.querySelector(".chat-row__meta")?.replaceWith(
        metaColumn({ read: step.type === "mine", time: step.time })
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
      await wait(1600);
      if (!state.cancelled) play();
    }
  }

  const stop = () => {
    state.cancelled = true;
    state.playing = false;
  };

  /* ── 화면에 보일 때만 재생 ─────────────────────────────────── */
  const card = log.closest(".chat-window") ?? log;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? play() : stop()));
      },
      { threshold: 0.2 }
    );
    observer.observe(card);
  } else {
    play();
  }

  // 다른 탭으로 갔을 때도 멈춘다
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else play();
  });
}
