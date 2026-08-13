/**
 * js/modules/identity.js
 * ---------------------------------------------------------------------------
 * 브랜드 페이지.
 *   · 이름 — 문장에서 잘라 온 두 조각을 한 줄로 조립한다
 *   · 디자인 모티프 — 단색 원 세 개
 *   · 컬러 아이덴티티 — 색마다 담긴 뜻 (한 줄씩 아래로 흐른다)
 *   · 웜톤 / 쿨톤 두 축
 *   · 심볼 설계도 · 로고 두 색 · 타이포 스케일
 */

import {
  NAMING,
  MOTIF,
  ORIGIN_PALETTE,
  TEMPERATURE,
  LOGO_BUILD,
  LOGO_PARTS,
  TYPE_SCALE,
} from "../data/identity.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml } from "./utils.js";

/* --------------------------------------------------------------------------
   1. 이름 — 문장에서 잘라 온 두 조각

   카드로 나눠 세우지 않는다. 남긴 글자와 덜어낸 글자를 한 줄 안에서
   그대로 보여 주는 것이 조립 과정을 읽기에 더 짧다.
   -------------------------------------------------------------------------- */
function renderNaming() {
  const sloganHost = $(".naming__slogan");
  const buildHost = $(".naming__build");
  const closing = $(".naming__closing");

  /* 이름이 나온 문장 — 잘라 온 두 조각만 문장 안에서 표시한다 */
  if (sloganHost) {
    let marked = escapeHtml(NAMING.slogan.en);
    NAMING.slogan.picks.forEach(([word, part]) => {
      const at = word.indexOf(part);
      if (at < 0) return;
      marked = marked.replace(
        word,
        word.slice(0, at) + `<b class="naming__pick">${part}</b>` + word.slice(at + part.length)
      );
    });

    sloganHost.innerHTML = `
      <p class="naming__slogan-en">${marked}</p>
      <p class="naming__slogan-ko">${escapeHtml(NAMING.slogan.ko)}</p>
    `;
  }

  /* 조립 한 줄 — 덜어낸 글자에는 취소선이 간다 */
  if (buildHost) {
    const word = (part) => {
      // 원래 단어에서 남긴 글자의 위치를 찾아 앞뒤로 나눈다
      const at = part.from.indexOf(part.take);
      const before = part.from.slice(0, at);
      const after = part.from.slice(at + part.take.length);
      return (
        `<span class="naming__from">` +
        (before ? `<s>${escapeHtml(before)}</s>` : "") +
        `<b>${escapeHtml(part.take)}</b>` +
        (after ? `<s>${escapeHtml(after)}</s>` : "") +
        `</span>`
      );
    };

    const keeperAt = NAMING.result.indexOf(NAMING.keeper);
    const result =
      escapeHtml(NAMING.result.slice(0, keeperAt)) +
      `<b>${escapeHtml(NAMING.keeper)}</b>` +
      escapeHtml(NAMING.result.slice(keeperAt + NAMING.keeper.length));

    buildHost.innerHTML =
      NAMING.parts.map(word).join(`<span class="naming__op" aria-hidden="true">+</span>`) +
      `<span class="naming__op" aria-hidden="true">=</span>` +
      `<span class="naming__result">${result}</span>` +
      `<span class="naming__keeper">가운데 남은 <b>${escapeHtml(NAMING.keeper)}</b> — ${escapeHtml(NAMING.keeperMeaning)}</span>`;
  }

  if (closing) closing.innerHTML = NAMING.closing;
}

/* --------------------------------------------------------------------------
   2. 디자인 모티프 — 단색 원 세 개
   -------------------------------------------------------------------------- */
function renderMotif() {
  const host = $(".motif__pearl");
  const legend = $(".motif__layers");
  if (!host) return;

  MOTIF.layers.forEach((layer) => {
    host.append(
      el("span", {
        className: "motif__layer",
        attrs: { "aria-hidden": "true" },
        style: { "--tone": `var(${layer.token})` },
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
        style: { "--tone": color.hex },
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
   5. 심볼 설계도 — 격자 위의 보조선 + 실제 심볼

   브랜드 가이드의 construction grid와 같은 방식이다. 격자와 원·대각선을 깔고
   그 위에 실제 심볼을 얹어, 어떤 기준으로 그려졌는지 눈으로 확인하게 한다.
   -------------------------------------------------------------------------- */
function renderLogoBuild() {
  const stage = $(".blueprint__stage");
  const notesHost = $(".blueprint__notes");
  const lead = $(".blueprint__lead");

  if (lead) lead.textContent = LOGO_BUILD.lead;

  if (stage) {
    const g = LOGO_BUILD.guides;

    const diagonals = g.diagonals
      .map((l) => `<line class="bp-diag" x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}"/>`)
      .join("");

    stage.innerHTML = `
      <svg class="blueprint__guides" viewBox="0 0 596 499" aria-hidden="true">
        <line class="bp-axis" x1="${g.axis}" y1="0" x2="${g.axis}" y2="499"/>
        <line class="bp-axis" x1="0" y1="${g.waist}" x2="596" y2="${g.waist}"/>
        ${diagonals}
        <circle class="bp-knot" cx="${g.knot.cx}" cy="${g.knot.cy}" r="7"/>
      </svg>
      <img class="blueprint__mark" src="assets/logo-mark.svg" alt="Emour 심볼">
    `;
  }

  if (notesHost) {
    LOGO_BUILD.notes.forEach((note, index) => {
      notesHost.append(
        el("li", {
          className: "blueprint__note",
          html: `
            <span class="blueprint__note-no">${String(index + 1).padStart(2, "0")}</span>
            <span>
              <b>${escapeHtml(note.label)}</b>
              <span>${escapeHtml(note.desc)}</span>
            </span>
          `,
        })
      );
    });
  }
}

/* --------------------------------------------------------------------------
   6. 로고 두 색 → 화면 두 축
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
            <span class="identity__logo-meaning">${escapeHtml(part.meaning)}</span>
            <span>${escapeHtml(part.role)}</span>
          </span>
        `,
      })
    );
  });
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
  renderLogoBuild();
  renderLogoParts();
  renderTypeScale();
}
