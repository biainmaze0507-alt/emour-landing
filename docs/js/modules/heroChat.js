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
 *   5. 상대의 마지막 말이 오면 문장 다듬기 추천이 올라온다
 *   6. 추천 칩을 오른쪽 끝까지 훑어 세 종류를 다 보여 준다
 *   7. 잠시 후 처음부터 반복
 *
 * 추천 칩은 실제 서비스와 같은 순서를 지킨다 — 대화가 오기 전에는 뜨지 않는다.
 *
 * 창 높이는 처음부터 끝까지 고정이다(CSS). 추천 칸이 열리면 로그 칸이 그만큼
 * 줄어들고 넘치는 옛 줄은 위로 밀려 잘린다 — 윤곽선은 어느 쪽으로도 흔들리지 않는다.
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

  /* 추천 칩은 한 번만 그려 두고, 보이는 시점만 클래스로 여닫는다.
     (매번 넣고 빼면 칸 높이가 바뀌어 창 윤곽선이 흔들린다) */
  const suggestBox = $(".hero-chat__suggests");
  if (suggestBox && !suggestBox.children.length) {
    suggestBox.append(suggestionChips(HERO_SUGGESTS));
  }
  const suggestRow = suggestBox?.querySelector(".suggests__row");

  const showSuggests = (on) => {
    // 감추기 전에 처음 위치로 돌려 둔다 (칸이 사라진 뒤에는 스크롤이 먹지 않는다)
    if (!on && suggestRow) {
      suggestRow.scrollLeft = 0;
      suggestRow.classList.remove("is-end");
    }
    suggestBox?.classList.toggle("is-on", on);
  };

  /**
   * 추천 칩을 오른쪽 끝까지 한 번 훑는다.
   * 칩은 세 종류(해결형 · 공감형 · 상냥하게)라 한 화면에 다 들어오지 않는다 —
   * 앱에서 손으로 넘겨 보는 자리이므로, 여기서는 그 폭을 대신 보여 준다.
   */
  async function panSuggests(state, duration = 2200) {
    if (!suggestRow) return;

    const distance = suggestRow.scrollWidth - suggestRow.clientWidth;
    if (distance <= 1) return;

    suggestRow.classList.add("is-panning");

    /* 화면이 그려지는 박자에 맞춰 한 프레임씩 옮긴다.
       프레임이 오지 않는 동안(다른 탭에 있을 때 등)에도 멈춰 있지 않도록
       시간 제한을 함께 걸어 둔다. */
    await Promise.race([
      new Promise((resolve) => {
        let start = null;

        const step = (now) => {
          if (state.cancelled) return resolve();
          start ??= now;

          const progress = Math.min((now - start) / duration, 1);
          // 시작과 끝을 부드럽게 (ease-in-out)
          const eased =
            progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;

          suggestRow.scrollLeft = distance * eased;

          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };

        requestAnimationFrame(step);
      }),
      wait(duration + 800),
    ]);

    suggestRow.classList.remove("is-panning");
    if (state.cancelled) return;

    suggestRow.scrollLeft = distance;
    suggestRow.classList.add("is-end");
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
    // 커서를 따라간다 — 한 줄을 넘기면 앞부분이 왼쪽으로 밀려 나간다
    input.scrollLeft = text ? input.scrollWidth : 0;
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
    showSuggests(true);
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
    showSuggests(false);

    for (const step of HERO_SCRIPT) {
      if (state.cancelled) break;

      if (step.type === "wait") {
        await wait(step.ms ?? 600);
        continue;
      }

      /* 추천이 올라오는 시점 — 올라온 뒤 세 종류를 훑어 보여 준다 */
      if (step.type === "suggest") {
        showSuggests(true);
        await wait(560);
        if (state.cancelled) break;
        await panSuggests(state);
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
