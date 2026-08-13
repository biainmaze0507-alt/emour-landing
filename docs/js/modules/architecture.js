/**
 * js/modules/architecture.js
 * ---------------------------------------------------------------------------
 * 시스템 아키텍처 · 기술 스택 · 규모 수치.
 * 다이어그램은 이미지가 아니라 레인(가로줄) 구조의 DOM 이라, 화면이 좁아지면
 * 자동으로 세로로 접힌다.
 */

import { SCALE_NUMBERS, ARCH_LANES, AI_PIPELINE, STACKS } from "../data/tech.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml, countUp, onceInView } from "./utils.js";

/** 노드 한 개 */
function archNode(node) {
  const path = node.path
    ? `<span class="arch__node-path">${escapeHtml(node.path)}</span>`
    : "";

  return el("div", {
    className: `arch__node${node.highlight ? " arch__node--model" : ""}`,
    style: { "--tone": `var(${node.tone})` },
    html: `
      <div class="arch__node-name">${escapeHtml(node.name)}</div>
      <div class="arch__node-role">${escapeHtml(node.role)}</div>
      ${path}
    `,
  });
}

/** 레인 한 줄 (제목 + 노드들) */
function archLane(lane) {
  const wrap = el("div", { className: "arch__lane" });

  if (lane.flow) {
    wrap.append(
      el("div", {
        className: "arch__flow",
        html: `${icon("chevronDown", 13)}<span>${escapeHtml(lane.flow)}</span>`,
      })
    );
  }

  wrap.append(el("div", { className: "arch__lane-title", text: lane.title }));

  const row = el("div", { className: "arch__row" });
  lane.nodes.forEach((node) => row.append(archNode(node)));
  wrap.append(row);

  return wrap;
}

export function initArchitecture() {
  /* ── 1. 규모 수치 ──────────────────────────────────────────── */
  const numbersHost = $(".tech__numbers");

  if (numbersHost) {
    SCALE_NUMBERS.forEach((item) => {
      const number = el("b");
      const value = el("span", { text: "0" });
      number.append(value, el("span", { text: item.suffix }));

      const cell = el("div", {
        className: "tech__number",
        children: [number, el("span", { text: item.label })],
      });

      numbersHost.append(cell);
      onceInView(cell, () => countUp(value, item.value, { duration: 1400 }));
    });
  }

  /* ── 2. 아키텍처 레인 ──────────────────────────────────────── */
  const laneHost = $(".arch__lanes");

  if (laneHost) {
    ARCH_LANES.forEach((lane) => laneHost.append(archLane(lane)));

    // AI 학습 파이프라인은 별도 레인으로 아래에 붙인다
    laneHost.append(
      archLane({
        flow: "감정 분석 · 답변 추천에 사용",
        title: "AI 학습 파이프라인",
        nodes: [
          {
            name: AI_PIPELINE.model,
            role: AI_PIPELINE.desc,
            tone: "--emotion-excitement",
            highlight: true,
          },
        ],
      })
    );

    // 학습 체인 뱃지
    const chain = el("div", { className: "tech__model-chain" });
    AI_PIPELINE.chain.forEach((step, index) => {
      if (index > 0) chain.append(el("span", { html: icon("arrowRight", 12), style: { border: "0", background: "none", padding: "0" } }));
      chain.append(el("span", { text: step }));
    });
    laneHost.append(chain);
  }

  /* ── 3. 기술 스택 ──────────────────────────────────────────── */
  const stackHost = $(".tech__stacks");

  if (stackHost) {
    STACKS.forEach((stack) => {
      const items = stack.items
        .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
        .join("");

      stackHost.append(
        el("div", {
          className: "tech__stack lift",
          style: { "--tone": `var(${stack.tone})` },
          attrs: { "data-reveal": "" },
          html: `
            <div class="tech__stack-title"><i></i>${escapeHtml(stack.title)}</div>
            <div class="tech__stack-items">${items}</div>
          `,
        })
      );
    });

    window.__emourObserveReveal?.(stackHost);
  }
}
