/**
 * js/modules/identity.js
 * ---------------------------------------------------------------------------
 * BI / CI 섹션.
 *   · 로고 두 색 설명
 *   · 코어 팔레트 트랙 (스와치에 올리면 넓어지고 아래 설명이 바뀐다)
 *   · 접근성 근거 — 대비값을 WCAG 공식으로 직접 계산해서 보여 준다
 *   · 타이포 스케일 (실제 크기 렌더)
 *   · 사용 규칙 목록
 */

import { LOGO_PARTS, CORE_PALETTE, CONTRAST_SAMPLES, TYPE_SCALE, RULES } from "../data/identity.js";
import { icon } from "../data/icons.js";
import { $, $$, el, escapeHtml, contrastRatio, contrastGrade } from "./utils.js";

/* --------------------------------------------------------------------------
   1. 로고 두 색
   -------------------------------------------------------------------------- */
function renderLogoParts() {
  const host = $(".identity__logo-parts");
  if (!host) return;

  LOGO_PARTS.forEach((part) => {
    host.append(
      el("div", {
        className: "identity__logo-part",
        style: { "--tone": part.hex },
        html: `
          <i></i>
          <span>
            <b>${escapeHtml(part.part)}</b>
            <span>${escapeHtml(part.role)}</span>
          </span>
          <code>${escapeHtml(part.hex)}</code>
        `,
      })
    );
  });
}

/* --------------------------------------------------------------------------
   2. 팔레트 트랙
   -------------------------------------------------------------------------- */
function renderPalette() {
  const track = $(".palette__track");
  const detail = $(".palette__detail");
  if (!track || !detail) return;

  const chip = detail.querySelector(".palette__detail-chip");
  const name = detail.querySelector(".palette__detail-name");
  const meta = detail.querySelector(".palette__detail-meta");
  const desc = detail.querySelector(".palette__detail-desc");

  const show = (color) => {
    detail.style.setProperty("--tone", color.hex);
    if (chip) chip.style.setProperty("--tone", color.hex);
    if (name) name.textContent = color.name;
    if (meta) {
      meta.innerHTML =
        `<span>${escapeHtml(color.hex)}</span>` +
        `<span>${escapeHtml(color.token)}</span>`;
    }
    if (desc) {
      // 글자만 살짝 페이드하며 교체
      desc.style.opacity = "0";
      setTimeout(() => {
        desc.textContent = color.desc;
        desc.style.opacity = "1";
      }, 120);
    }
  };

  CORE_PALETTE.forEach((color, index) => {
    const swatch = el("button", {
      className: "palette__swatch",
      attrs: {
        type: "button",
        "aria-selected": index === 4, // 기본 선택은 브랜드 로즈
        "aria-label": `${color.name} ${color.hex}`,
      },
      style: { "--tone": color.hex, "--ink": color.ink },
      html: `<span class="palette__swatch-name">${escapeHtml(color.name)}</span>`,
    });

    const select = () => {
      $$(".palette__swatch", track).forEach((node) => node.setAttribute("aria-selected", "false"));
      swatch.setAttribute("aria-selected", "true");
      show(color);
    };

    swatch.addEventListener("pointerenter", select);
    swatch.addEventListener("click", select);
    swatch.addEventListener("focus", select);

    track.append(swatch);
  });

  show(CORE_PALETTE[4]);
}

/* --------------------------------------------------------------------------
   3. 접근성 근거
   대비값을 손으로 적지 않고 계산한다 — 색을 바꾸면 숫자도 자동으로 맞는다.
   -------------------------------------------------------------------------- */
function renderContrast() {
  const host = $(".contrast__demo");
  if (!host) return;

  CONTRAST_SAMPLES.forEach((sample) => {
    const ratio = contrastRatio(sample.hex, "#FFFFFF");
    const grade = contrastGrade(ratio);

    host.append(
      el("div", {
        className: "contrast__sample",
        style: { "--tone": sample.hex },
        html: `
          <span>
            <span class="contrast__sample-text">${escapeHtml(sample.text)}</span>
            <br><span style="font-size:11px;opacity:.78">${escapeHtml(sample.caption)} · ${escapeHtml(sample.hex)}</span>
          </span>
          <span class="contrast__sample-ratio">
            ${ratio.toFixed(2)}:1
            <span class="contrast__verdict ${grade.pass ? "is-pass" : "is-fail"}">${escapeHtml(grade.label)}</span>
          </span>
        `,
      })
    );
  });
}

/* --------------------------------------------------------------------------
   4. 타이포 스케일
   -------------------------------------------------------------------------- */
function renderTypeScale() {
  const host = $(".typescale__rows");
  if (!host) return;

  TYPE_SCALE.forEach((row) => {
    host.append(
      el("div", {
        className: "typescale__row",
        style: { "--size": `${row.size}px` },
        html: `
          <span class="typescale__token">${escapeHtml(row.token)}</span>
          <span class="typescale__sample">받는 말에 감정을 담고</span>
          <span class="typescale__size">${row.size}px</span>
        `,
      })
    );
  });
}

/* --------------------------------------------------------------------------
   5. 사용 규칙
   -------------------------------------------------------------------------- */
function renderRules() {
  const doHost = $(".rules__col--do .rules__list");
  const dontHost = $(".rules__col--dont .rules__list");

  RULES.do.forEach((text) => doHost?.append(el("li", { text })));
  RULES.dont.forEach((text) => dontHost?.append(el("li", { text })));

  const doTitle = $(".rules__col--do .rules__title");
  const dontTitle = $(".rules__col--dont .rules__title");
  if (doTitle) doTitle.insertAdjacentHTML("afterbegin", icon("check", 16));
  if (dontTitle) dontTitle.insertAdjacentHTML("afterbegin", icon("x", 16));
}

export function initIdentity() {
  renderLogoParts();
  renderPalette();
  renderContrast();
  renderTypeScale();
  renderRules();
}
