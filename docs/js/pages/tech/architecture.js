/**
 * js/pages/tech/architecture.js
 * ---------------------------------------------------------------------------
 * 시스템 아키텍처 · 기술 스택 · 규모 수치.
 * 다이어그램은 이미지가 아니라 레인(가로줄) 구조의 DOM이라, 화면이 좁아지면
 * 자동으로 세로로 접힌다.
 */

import { SCALE_NUMBERS, ARCH_LANES, AI_PIPELINE, STACKS } from "./tech.data.js";
import { LINKS } from "../../data/site.js";
import { icon } from "../../data/icons.js";
import { $, el, escapeHtml, countUp, onceInView } from "../../shared/utils.js";

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
  }

  /* ── 2-1. AI 학습 파이프라인 ───────────────────────────────────
     자기 자리(.arch__ai)가 있으면 거기에, 없으면 아키텍처 레인 아래에 붙인다.
     ------------------------------------------------------------ */
  const aiHost = $(".arch__ai") ?? laneHost;

  if (aiHost) {
    /* 학습 순서 한 줄. 마지막 칸이 결과 모델이고, 허깅페이스로 바로 연결된다.
       모델 이름만 따로 카드로 띄우지 않는다 — 순서의 마지막 칸일 뿐이다. */
    const chain = el("div", { className: "tech__model-chain" });

    AI_PIPELINE.chain.forEach((step, index) => {
      if (index > 0) {
        chain.append(el("span", { className: "tech__model-arrow", html: icon("arrowRight", 12) }));
      }
      chain.append(el("span", { className: "tech__model-step", text: step }));
    });

    chain.append(el("span", { className: "tech__model-arrow", html: icon("arrowRight", 12) }));
    chain.append(
      el(LINKS.model ? "a" : "span", {
        className: "tech__model-step tech__model-step--result",
        attrs: LINKS.model
          ? { href: LINKS.model, target: "_blank", rel: "noopener noreferrer" }
          : {},
        html: `${escapeHtml(AI_PIPELINE.model)}${LINKS.model ? icon("arrowUpRight", 12) : ""}`,
      })
    );

    aiHost.append(chain);
    aiHost.append(el("p", { className: "tech__model-desc", text: AI_PIPELINE.desc }));
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
