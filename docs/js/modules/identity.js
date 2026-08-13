/**
 * js/modules/identity.js
 * ---------------------------------------------------------------------------
 * 브랜드 페이지.
 *   · 이름 조립 — Emotion 과 Amour 에서 글자를 덜어내 our 를 남긴다
 *   · 디자인 모티프 — 진주 층을 실제로 겹쳐 그린다
 *   · 컬러 아이덴티티 — 색마다 담긴 뜻 (한 줄씩 아래로 흐른다)
 *   · 웜톤 / 쿨톤 두 축
 *   · 로고 두 색 · 타이포 스케일 · 대비 근거 · 사용 규칙
 */

import {
  NAMING,
  MOTIF,
  ORIGIN_PALETTE,
  PALETTE_NOTE,
  TEMPERATURE,
  LOGO_PARTS,
  LOGO_NOTE,
  TYPE_SCALE,
  CONTRAST_SAMPLES,
  CONTRAST_NOTE,
  RULES,
} from "../data/identity.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml, contrastRatio, contrastGrade, onceInView } from "./utils.js";

/* --------------------------------------------------------------------------
   1. 이름 — 글자를 덜어내는 과정
   가져온 글자(take)는 남고, 덜어낸 글자(drop)는 옅어지며 지워진다.
   -------------------------------------------------------------------------- */
function renderNaming() {
  const host = $(".naming__steps");
  const resultHost = $(".naming__result");
  const closing = $(".naming__closing");
  const sloganHost = $(".naming__slogan");
  if (!host) return;

  /* 이름이 나온 문장 — 잘라 온 두 조각(Em · our)만 문장 안에서 표시한다 */
  if (sloganHost) {
    let marked = escapeHtml(NAMING.slogan.en);
    NAMING.slogan.picks.forEach(([word, part]) => {
      // 그 단어를 찾아, 단어 안의 해당 조각만 감싼다
      const at = word.indexOf(part);
      if (at < 0) return;
      const wrapped =
        word.slice(0, at) +
        `<b class="naming__pick">${part}</b>` +
        word.slice(at + part.length);
      marked = marked.replace(word, wrapped);
    });

    sloganHost.innerHTML = `
      <p class="naming__slogan-en">${marked}</p>
      <p class="naming__slogan-ko">${escapeHtml(NAMING.slogan.ko)}</p>
    `;
  }

  NAMING.steps.forEach((step) => {
    // 원래 단어를 글자 단위로 쪼개, 남길 글자와 덜어낼 글자를 나눈다
    const takeIndex = step.word.toLowerCase().indexOf(step.take.toLowerCase());
    const letters = step.word
      .split("")
      .map((letter, index) => {
        const kept = index >= takeIndex && index < takeIndex + step.take.length;
        return `<span class="naming__letter${kept ? " is-kept" : " is-dropped"}">${escapeHtml(letter)}</span>`;
      })
      .join("");

    host.append(
      el("div", {
        className: "naming__step",
        attrs: { "data-reveal": "" },
        html: `
          <p class="naming__word">${letters}</p>
          <p class="naming__note">${escapeHtml(step.note)}</p>
          <p class="naming__taken">
            <span>남긴 글자</span>
            <b>${escapeHtml(step.take)}</b>
          </p>
        `,
      })
    );
  });

  if (resultHost) {
    // 결과 단어 안에서 keeper(our)만 강조한다
    const index = NAMING.result.toLowerCase().indexOf(NAMING.keeper.toLowerCase());
    const letters = NAMING.result
      .split("")
      .map((letter, i) => {
        const isKeeper = index >= 0 && i >= index && i < index + NAMING.keeper.length;
        return `<span class="naming__letter${isKeeper ? " is-keeper" : ""}">${escapeHtml(letter)}</span>`;
      })
      .join("");

    resultHost.innerHTML = `
      <p class="naming__result-word">${letters}</p>
      <p class="naming__result-note">
        이름 가운데 남은 <b>${escapeHtml(NAMING.keeper)}</b> —
        ${escapeHtml(NAMING.keeperMeaning)}
      </p>
    `;
  }

  if (closing) closing.innerHTML = NAMING.closing;
  window.__emourObserveReveal?.(host);
}

/* --------------------------------------------------------------------------
   2. 디자인 모티프 — 진주 층
   안쪽부터 바깥쪽으로 원을 겹쳐, 층이 쌓여 하나의 빛이 되는 모양을 만든다.
   -------------------------------------------------------------------------- */
function renderMotif() {
  const host = $(".motif__pearl");
  const legend = $(".motif__layers");
  if (!host) return;

  const total = MOTIF.layers.length;

  MOTIF.layers.forEach((layer, index) => {
    // 마지막 층이 가장 크다 (바깥쪽)
    const scale = 34 + ((index + 1) / total) * 66;

    host.append(
      el("span", {
        className: "motif__layer",
        attrs: { "aria-hidden": "true" },
        style: {
          "--tone": `var(${layer.token})`,
          "--size": `${scale}%`,
          "--index": String(index),
        },
      })
    );

    legend?.append(
      el("li", {
        className: "motif__layer-row",
        style: { "--tone": `var(${layer.token})` },
        html: `
          <i></i>
          <span>
            <b>${escapeHtml(layer.label)}</b>
            <span>${escapeHtml(layer.note)}</span>
          </span>
        `,
      })
    );
  });

  // 화면에 들어올 때 안쪽부터 순서대로 부풀어 오른다
  onceInView(host, () => host.classList.add("is-in"), { threshold: 0.35 });
}

/* --------------------------------------------------------------------------
   3. 컬러 아이덴티티 — 색마다 담긴 뜻
   -------------------------------------------------------------------------- */
function renderPalette() {
  const host = $(".palette");
  const note = $(".palette__note");
  if (!host) return;

  if (note) note.innerHTML = PALETTE_NOTE;

  ORIGIN_PALETTE.forEach((color) => {
    host.append(
      el("li", {
        className: "palette__row",
        attrs: { "data-reveal": "" },
        // 진주 바깥 테 = CI 원안, 안쪽 알 = 화면 적용값
        style: { "--origin": color.origin, "--applied": color.applied },
        html: `
          <span class="palette__pearl" aria-hidden="true"></span>
          <span class="palette__row-id">
            <b class="palette__row-name">${escapeHtml(color.name)}</b>
            <span class="palette__row-role">${escapeHtml(color.role)}</span>
          </span>
          <span class="palette__row-body">
            <span class="palette__row-meaning">${escapeHtml(color.meaning)}</span>
            <span class="palette__row-desc">${escapeHtml(color.desc)}</span>
          </span>
        `,
      })
    );
  });

  window.__emourObserveReveal?.(host);
}

/* --------------------------------------------------------------------------
   4. 웜톤 / 쿨톤 두 축
   -------------------------------------------------------------------------- */
function renderTemperature() {
  const host = $(".temp__sides");
  const closing = $(".temp__closing");
  if (!host) return;

  TEMPERATURE.sides.forEach((side) => {
    const roles = side.roles
      .map((role) => `<li>${escapeHtml(role)}</li>`)
      .join("");

    host.append(
      el("div", {
        className: `temp__side temp__side--${side.key}`,
        attrs: { "data-reveal": "" },
        style: { "--tone": side.hex },
        html: `
          <span class="temp__badge">${escapeHtml(side.badge)}</span>
          <span class="temp__chip"></span>
          <h3 class="temp__title">${escapeHtml(side.title)}</h3>
          <p class="temp__body">${escapeHtml(side.body)}</p>
          <ul class="temp__roles">${roles}</ul>
        `,
      })
    );
  });

  if (closing) closing.innerHTML = TEMPERATURE.closing;
  window.__emourObserveReveal?.(host);
}

/* --------------------------------------------------------------------------
   5. 로고 두 색
   -------------------------------------------------------------------------- */
function renderLogoParts() {
  const host = $(".identity__logo-parts");
  const note = $(".identity__logo-note");

  if (host) {
    LOGO_PARTS.forEach((part) => {
      host.append(
        el("div", {
          className: "identity__logo-part",
          style: { "--tone": part.hex },
          html: `
            <i></i>
            <span>
              <b>${escapeHtml(part.part)}</b>
              <span class="identity__logo-meaning">${escapeHtml(part.meaning)}</span>
              <span>${escapeHtml(part.role)}</span>
            </span>
          `,
        })
      );
    });
  }

  if (note) {
    note.innerHTML = `
      <b>${escapeHtml(LOGO_NOTE.title)}</b>
      <span>${LOGO_NOTE.body}</span>
    `;
  }
}

/* --------------------------------------------------------------------------
   6. 타이포 스케일
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
   7. 대비 근거
   대비값을 손으로 적지 않고 계산한다 — 색을 바꾸면 숫자도 자동으로 맞는다.
   -------------------------------------------------------------------------- */
function renderContrast() {
  const host = $(".contrast__demo");
  const note = $(".contrast__note");
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
            <span class="contrast__sample-cap">${escapeHtml(sample.caption)}</span>
          </span>
          <span class="contrast__sample-ratio">
            ${ratio.toFixed(2)}:1
            <span class="contrast__verdict ${grade.pass ? "is-pass" : "is-fail"}">${escapeHtml(grade.label)}</span>
          </span>
        `,
      })
    );
  });

  if (note) note.innerHTML = CONTRAST_NOTE;
}

/* --------------------------------------------------------------------------
   8. 사용 규칙
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
  renderNaming();
  renderMotif();
  renderPalette();
  renderTemperature();
  renderLogoParts();
  renderTypeScale();
  renderContrast();
  renderRules();
}
