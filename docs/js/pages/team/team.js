/**
 * js/pages/team/team.js
 * ---------------------------------------------------------------------------
 * 팀원 카드.
 *
 * 아바타는 발표자료 팀원 소개 슬라이드의 원본 일러스트 파일을 그대로 쓴다.
 * (assets/team/*.svg) 경로는 js/pages/team/team.data.js의 avatar에 적혀 있다.
 */

import { TEAM } from "./team.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

function memberCard(member) {
  const roles = member.roles
    .map((role) => `<span class="member__role">${escapeHtml(role.toUpperCase())}</span>`)
    .join("");

  const tags = member.tags
    .map((tag) => `<span class="member__tag">${escapeHtml(tag)}</span>`)
    .join("");

  return el("article", {
    className: "member",
    style: { "--tone": `var(${member.tone})` },
    attrs: { "data-reveal": "" },
    html: `
      <span class="member__avatar">
        <img src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)} 일러스트"
             loading="lazy" decoding="async">
      </span>
      <span class="member__roles">${roles}</span>
      <span class="member__name">${escapeHtml(member.name)}</span>
      <span class="member__blurb">${escapeHtml(member.blurb)}</span>
      <span class="member__tags">${tags}</span>
    `,
  });
}

export function initTeam() {
  const grid = $(".team__grid");
  if (!grid) return;

  TEAM.forEach((member) => grid.append(memberCard(member)));
  window.__emourObserveReveal?.(grid);
}
