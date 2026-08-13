/**
 * js/modules/why.js
 * ---------------------------------------------------------------------------
 * 기획 배경 섹션의 "감정 단서" 스위치.
 *
 * 같은 대화를 두 번 그리지 않는다. 말풍선은 하나만 만들고,
 * 감정 태그와 색만 CSS 클래스(.is-on)로 켜고 끈다.
 * → 스위치를 눌러도 레이아웃이 전혀 흔들리지 않는다.
 *
 * 상태는 사용자가 누를 때만 바뀐다. 저절로 켜지지 않는다 —
 * 읽는 중에 화면이 알아서 변하면 무엇 때문에 바뀌었는지 알 수 없다.
 */

import { $ } from "./utils.js";
import { bubbleRow } from "./render.js";

/** 스위치가 꺼졌을 때는 감정을 감춰야 하므로 감정 코드를 따로 들고 있는다. */
const CONVERSATION = [
  { side: "mine", text: "나 오늘 친구들이랑 늦게까지 놀다 올게", emotion: "COMFORT", time: "오후 4:53", read: true },
  { side: "yours", text: "어제도 늦게 왔잖아…", emotion: "HURT", time: "오후 4:53" },
  { side: "yours", text: "오늘은 같이 있기로 한거 아니었어?", emotion: "EMBARRASSMENT", time: "오후 4:53" },
  { side: "mine", text: "그래도 약속 미리 잡은건데 어떡해", emotion: "WORRY", time: "오후 4:54", read: true },
  { side: "yours", text: "그래 네 마음대로 해", emotion: "ANGER", time: "오후 4:54" },
];

export function initWhy() {
  const stage = $(".why__stage");
  const chat = $(".why__chat");
  const toggle = $(".why__switch");
  const labelOff = $('[data-switch-label="off"]');
  const labelOn = $('[data-switch-label="on"]');

  if (!stage || !chat || !toggle) return;

  /* 대화를 한 번만 그린다 */
  CONVERSATION.forEach((row, index) => {
    const node = bubbleRow(row);
    // 태그가 순서대로 하나씩 켜지도록 지연을 준다
    const tag = node.querySelector(".emotion-tag");
    if (tag) tag.style.setProperty("--delay", `${index * 110}ms`);
    chat.append(node);
  });

  /* 스위치 */
  const setState = (on) => {
    stage.classList.toggle("is-on", on);
    toggle.setAttribute("aria-checked", String(on));
    labelOff?.classList.toggle("is-on", !on);
    labelOn?.classList.toggle("is-on", on);
  };

  toggle.addEventListener("click", () => {
    setState(toggle.getAttribute("aria-checked") !== "true");
  });

  // 스페이스/엔터로도 눌린다 (role="switch" 인 button이라 기본 동작으로 처리됨)
  toggle.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle.click();
    }
  });

  setState(false);
}
