/**
 * js/modules/why.js
 * ---------------------------------------------------------------------------
 * 기획 배경 섹션의 "감정 단서" 스위치.
 *
 * 같은 대화를 두 번 그리지 않는다. 말풍선은 하나만 만들고,
 * 감정 태그와 색만 CSS 클래스(.is-on)로 켜고 끈다.
 * → 스위치를 눌러도 레이아웃이 전혀 흔들리지 않는다.
 *
 * 처음 화면에 들어오면 잠깐 뒤 자동으로 한 번 켜져서
 * "여기 눌러 볼 게 있다"는 걸 알려 준다(모션 최소화 시에는 켠 채로 시작).
 */

import { $, el, onceInView, prefersReducedMotion } from "./utils.js";
import { bubbleRow } from "./render.js";

/** 스위치가 꺼졌을 때는 감정을 감춰야 하므로 감정 코드를 따로 들고 있는다. */
const CONVERSATION = [
  { side: "yours", text: "나 오늘 회사에서 진짜 힘들었어", emotion: "DISTRESS", time: "오후 11:12" },
  { side: "mine", text: "그랬구나", emotion: "COMFORT", time: "오후 11:20", read: true },
  { side: "yours", text: "…응", emotion: "HURT", time: "오후 11:21" },
  { side: "mine", text: "그래, 네 마음대로 해.", emotion: "SADNESS", time: "오후 11:27", read: true },
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

  // 스페이스/엔터로도 눌린다 (role="switch" 인 button 이라 기본 동작으로 처리됨)
  toggle.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      toggle.click();
    }
  });

  setState(false);

  /* 처음 보일 때 자동으로 한 번 켜 준다 */
  if (prefersReducedMotion()) {
    setState(true);
    return;
  }

  onceInView(
    stage,
    () => {
      setTimeout(() => {
        // 사용자가 이미 눌러 봤다면 건드리지 않는다
        if (toggle.getAttribute("aria-checked") !== "true") setState(true);
      }, 1200);
    },
    { threshold: 0.4 }
  );
}
