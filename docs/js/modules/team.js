/**
 * js/modules/team.js
 * ---------------------------------------------------------------------------
 * 팀원 카드.
 *
 * 핵심: portfolio 주소가 있으면 카드 전체가 <a> 로, 없으면 <article> 로 렌더된다.
 *       두 경우의 마크업 구조와 크기가 완전히 같아서, 나중에 주소만 채워도
 *       레이아웃이 전혀 흔들리지 않는다.
 *       → js/data/team.js 의 portfolio 값만 수정하면 됩니다.
 *
 * 아바타는 발표자료 팀원 소개 슬라이드의 일러스트를 SVG 로 다시 그린 것이다.
 * (js/data/avatars.js) 사진을 넣으면 사진이 그 자리를 대신한다.
 */

import { TEAM, TEAM_BANNER } from "../data/team.js";
import { avatarSvg } from "../data/avatars.js";
import { icon } from "../data/icons.js";
import { $, el, escapeHtml } from "./utils.js";

function memberCard(member) {
  const hasLink = Boolean(member.portfolio);

  // 사진이 있으면 사진, 없으면 일러스트
  const avatarInner = member.avatar
    ? `<img src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name)} 프로필 사진" loading="lazy" decoding="async">`
    : avatarSvg(member.face, member.name);

  const roles = member.roles
    .map((role) => `<span class="member__role">${escapeHtml(role.toUpperCase())}</span>`)
    .join("");

  const tags = member.tags
    .map((tag) => `<span class="member__tag">${escapeHtml(tag)}</span>`)
    .join("");

  const foot = hasLink
    ? `<span class="member__link">포트폴리오 보기 ${icon("arrowUpRight", 14)}</span>`
    : `<span class="member__link member__link--soon">포트폴리오 준비 중</span>`;

  const html = `
    <span class="member__avatar">${avatarInner}</span>
    <span class="member__roles">${roles}</span>
    <span class="member__name">${escapeHtml(member.name)}</span>
    <span class="member__blurb">${escapeHtml(member.blurb)}</span>
    <span class="member__tags">${tags}</span>
    <span class="member__foot">${foot}</span>
  `;

  // 링크가 있을 때만 <a> 로 만든다
  return el(hasLink ? "a" : "article", {
    className: "member",
    style: { "--tone": `var(${member.tone})` },
    attrs: hasLink
      ? {
          href: member.portfolio,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": `${member.name} 포트폴리오 (새 창)`,
          "data-reveal": "",
        }
      : { "data-reveal": "" },
    html,
  });
}

export function initTeam() {
  const grid = $(".team__grid");
  if (grid) {
    TEAM.forEach((member) => grid.append(memberCard(member)));
    window.__emourObserveReveal?.(grid);
  }

  const bannerTitle = $(".team__banner-title");
  const bannerDesc = $(".team__banner-desc");
  if (bannerTitle) bannerTitle.textContent = TEAM_BANNER.title;
  if (bannerDesc) bannerDesc.textContent = TEAM_BANNER.desc;
}
