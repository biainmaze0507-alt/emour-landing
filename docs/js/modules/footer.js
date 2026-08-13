/**
 * js/modules/footer.js
 * ---------------------------------------------------------------------------
 * 푸터 링크 묶음과 연도 표기.
 */

import { FOOTER_GROUPS, SITE } from "../data/site.js";
import { $, $$, el, escapeHtml } from "./utils.js";

export function renderFooter() {
  const host = $(".footer-links");
  if (!host) return;

  FOOTER_GROUPS.forEach((group) => {
    // 주소가 비어 있는 항목은 목록에서 뺀다 (죽은 링크를 두지 않는다)
    const items = group.items
      .filter((item) => item.href)
      .map((item) => {
        const external = item.external
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return `<li><a href="${escapeHtml(item.href)}"${external}>${escapeHtml(item.label)}</a></li>`;
      })
      .join("");

    if (!items) return;

    host.append(
      el("div", {
        html: `
          <p class="footer-links__title">${escapeHtml(group.title)}</p>
          <ul>${items}</ul>
        `,
      })
    );
  });
}

/** ⓒ 연도와 팀 표기를 한 곳(data/site.js)에서 관리한다. */
export function renderYear() {
  $$("[data-year]").forEach((node) => {
    node.textContent = String(SITE.year);
  });
  $$("[data-team-label]").forEach((node) => {
    node.textContent = SITE.team;
  });
}
