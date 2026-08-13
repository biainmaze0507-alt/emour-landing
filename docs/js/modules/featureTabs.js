/**
 * js/modules/featureTabs.js
 * ---------------------------------------------------------------------------
 * 핵심 기능 3종 — 탭 목록 · 앱 목업 · 근거 패널을 한 번에 만든다.
 *
 * 목업은 이미지가 아니라 실제 DOM 이다. 그래서
 *   · 디자인 토큰을 바꾸면 목업도 같이 바뀌고
 *   · 텍스트를 화면에서 그대로 읽을 수 있으며(접근성·SEO)
 *   · 어떤 화면 크기에서도 흐릿해지지 않는다.
 *
 * 접근성: role="tablist" / "tab" / "tabpanel" 규약을 지키고
 *        ← → Home End 키로 이동할 수 있다.
 */

import { FEATURES } from "../data/features.js";
import { icon } from "../data/icons.js";
import { $, $$, el, escapeHtml, onceInView } from "./utils.js";
import { bubbleRow, donutSvg, flowSvg } from "./render.js";
import { getEmotion } from "../data/emotions.js";

/* --------------------------------------------------------------------------
   목업 껍데기 — 상단바 · 본문 · 하단 내비
   -------------------------------------------------------------------------- */
function deviceChrome(title, bodyNode, { activeNav = "채팅" } = {}) {
  const navItems = [
    { label: "홈", name: "home" },
    { label: "채팅", name: "messageCircle" },
    { label: "캘린더", name: "calendar" },
    { label: "앨범", name: "image" },
    { label: "마이", name: "user" },
  ];

  const topbar = el("div", {
    className: "device__topbar",
    html: `
      <span class="device__topbar-icon">${icon("chevronLeft", 18)}</span>
      <span>${escapeHtml(title)}</span>
      <span class="device__topbar-icon">${icon("search", 18)}</span>
    `,
  });

  const nav = el("div", { className: "device__nav" });
  navItems.forEach((item) => {
    nav.append(
      el("span", {
        className: `device__nav-item${item.label === activeNav ? " is-active" : ""}`,
        html: `${icon(item.name, 17)}<span>${escapeHtml(item.label)}</span>`,
      })
    );
  });

  return el("div", {
    className: "device",
    children: [
      el("div", { className: "device__notch" }),
      el("div", {
        className: "device__screen",
        children: [topbar, bodyNode, nav],
      }),
    ],
  });
}

/* --------------------------------------------------------------------------
   화면 내용 3종
   -------------------------------------------------------------------------- */

/** kind: "chat" — 말풍선만 */
function screenChat(screen) {
  const body = el("div", { className: "device__body" });
  body.append(el("div", { className: "features__panel-title", text: "오늘" }));
  screen.rows.forEach((row) => body.append(bubbleRow(row)));
  return body;
}

/** kind: "suggest" — 말풍선 + 답장 추천 카드 */
function screenSuggest(screen) {
  const body = el("div", { className: "device__body" });
  screen.rows.forEach((row) => body.append(bubbleRow(row)));

  // 답장 추천 묶음은 화면 아래쪽에 붙인다
  const suggestWrap = el("div", {
    style: { "margin-top": "auto", display: "grid", gap: "6px" },
  });
  suggestWrap.append(
    el("div", { className: "features__panel-title", text: "답장 추천" })
  );

  screen.suggests.forEach((item) => {
    suggestWrap.append(
      el("div", {
        className: "suggest-card",
        html: `
          <span class="suggest-card__kind">${escapeHtml(item.kind)}</span>
          <p class="suggest-card__text">${escapeHtml(item.text)}</p>
        `,
      })
    );
  });

  body.append(suggestWrap);
  return body;
}

/** kind: "dashboard" — 통계 타일 + 도넛 + 요약 */
function screenDashboard(screen) {
  const body = el("div", { className: "device__body" });

  body.append(
    el("div", {
      className: "features__panel-title",
      text: `주간 · ${screen.period}`,
    })
  );

  // 상단 3칸
  const stats = el("div", { className: "mini-stats" });
  screen.stats.forEach((stat) => {
    stats.append(
      el("div", { html: `<b>${escapeHtml(stat.value)}</b><span>${escapeHtml(stat.label)}</span>` })
    );
  });
  body.append(stats);

  // 도넛 + 범례 (범례는 상위 5개만 — 목업 안에서 다 넣으면 읽히지 않는다)
  const legendItems = screen.donut
    .slice(0, 5)
    .map((slice) => {
      const emotion = getEmotion(slice.code);
      return (
        `<li style="--tone: var(${emotion.token})"><i></i>` +
        `${escapeHtml(emotion.label)} ${slice.pct}%</li>`
      );
    })
    .join("");

  body.append(
    el("div", {
      className: "mini-card",
      html: `
        <span class="mini-card__title">주간 채팅 감정 분포 비율</span>
        <span class="mini-card__sub">어떤 감정이 얼마나 오갔는지 모아봤어요</span>
        <div class="mini-donut">
          ${donutSvg(screen.donut, { size: 100, thickness: 17 })}
          <ul class="mini-legend">${legendItems}</ul>
        </div>
      `,
    })
  );

  // 감정 흐름 그래프
  if (screen.flow) {
    const axis = screen.flow.hours
      .map((hour) => `<span>${escapeHtml(hour)}</span>`)
      .join("");

    body.append(
      el("div", {
        className: "mini-card",
        html: `
          <span class="mini-card__title">감정 흐름</span>
          <span class="mini-card__sub">하루 중 어느 시간에 마음이 오르내렸는지 이어봤어요</span>
          <div class="mini-flow">${flowSvg(screen.flow)}</div>
          <div class="mini-flow__axis">${axis}</div>
          <div class="mini-flow__legend">
            <span><i style="--tone: var(--emotion-positive)"></i>긍정</span>
            <span><i style="--tone: var(--emotion-negative)"></i>부정</span>
          </div>
        `,
      })
    );
  }

  // 하단 요약 2칸
  const footer = el("div", {
    className: "mini-stats",
    style: { "grid-template-columns": "1fr 1fr", "margin-top": "auto" },
  });
  screen.footer.forEach((item) => {
    footer.append(
      el("div", {
        html: `<span>${escapeHtml(item.label)}</span><b style="font-size:12px">${escapeHtml(item.value)}</b>`,
      })
    );
  });
  body.append(footer);

  return body;
}

const SCREEN_RENDERERS = {
  chat: screenChat,
  suggest: screenSuggest,
  dashboard: screenDashboard,
};

/* --------------------------------------------------------------------------
   근거 패널 (오른쪽)
   -------------------------------------------------------------------------- */
function detailPanel(feature, index) {
  const { detail } = feature;

  const points = detail.points
    .map((point) => `<li class="features__point">${escapeHtml(point)}</li>`)
    .join("");

  const metrics = detail.metrics
    .map(
      (metric) => `
        <div class="features__metric-row" data-metric="${metric.pct}">
          <div class="features__metric-top">
            <span>${escapeHtml(metric.label)}</span>
            <b>${escapeHtml(metric.value)}</b>
          </div>
          <div class="meter"><div class="meter__fill"></div></div>
        </div>`
    )
    .join("");

  return el("div", {
    className: `features__detail${index === 0 ? " is-active" : ""}`,
    attrs: {
      id: `feature-detail-${feature.id}`,
      role: "tabpanel",
      "aria-labelledby": `feature-tab-${feature.id}`,
      tabindex: "0",
    },
    html: `
      <p class="features__detail-kicker">${escapeHtml(detail.kicker)}</p>
      <h3 class="features__detail-title">${escapeHtml(detail.title)}</h3>
      <p class="features__detail-body">${escapeHtml(detail.body)}</p>
      <ul class="features__points">${points}</ul>
      <div class="features__metrics">${metrics}</div>
    `,
  });
}

/* --------------------------------------------------------------------------
   초기화
   -------------------------------------------------------------------------- */
export function initFeatureTabs() {
  const tabList = $(".features__tabs");
  const deviceWrap = $(".features__device-wrap");
  const detailWrap = $(".features__details");

  if (!tabList || !deviceWrap || !detailWrap) return;

  /* 1. 탭 버튼 */
  FEATURES.forEach((feature, index) => {
    tabList.append(
      el("button", {
        className: "features__tab",
        attrs: {
          type: "button",
          role: "tab",
          id: `feature-tab-${feature.id}`,
          "aria-controls": `feature-detail-${feature.id}`,
          "aria-selected": index === 0,
          tabindex: index === 0 ? "0" : "-1",
          "data-feature": feature.id,
        },
        html: `
          <span class="features__tab-icon">${icon(feature.icon, 19)}</span>
          <span>
            <span class="features__tab-title">${escapeHtml(feature.title)}</span>
            <span class="features__tab-desc">${escapeHtml(feature.short)}</span>
          </span>
        `,
      })
    );
  });

  /* 2. 목업 — 한 대에 화면 세 개를 겹쳐 두고 하나만 보여 준다 */
  const screensHost = el("div", { className: "device__body", style: { padding: "0" } });

  FEATURES.forEach((feature, index) => {
    const render = SCREEN_RENDERERS[feature.screen.kind];
    const body = render(feature.screen); // 각 화면은 자기 .device__body 를 만들어 온다
    const panel = el("div", {
      className: `features__panel${index === 0 ? " is-active" : ""}`,
      attrs: { "data-panel": feature.id },
      children: [body],
      style: { flex: "1", "min-height": "0" },
    });
    screensHost.append(panel);
  });

  // 상단바 제목은 탭에 따라 바뀌므로 따로 참조를 잡아 둔다
  const device = deviceChrome(FEATURES[0].screen.topbar, screensHost, {
    activeNav: "채팅",
  });
  deviceWrap.append(device);

  const topbarTitle = device.querySelector(".device__topbar span:nth-child(2)");
  const navItems = $$(".device__nav-item", device);

  /* 3. 근거 패널 */
  FEATURES.forEach((feature, index) => detailWrap.append(detailPanel(feature, index)));

  /* 4. 전환 */
  const select = (id) => {
    const feature = FEATURES.find((f) => f.id === id);
    if (!feature) return;

    $$(".features__tab", tabList).forEach((tab) => {
      const on = tab.dataset.feature === id;
      tab.setAttribute("aria-selected", String(on));
      tab.setAttribute("tabindex", on ? "0" : "-1");
    });

    $$(".features__panel[data-panel]", screensHost).forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === id);
    });

    $$(".features__detail", detailWrap).forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `feature-detail-${id}`);
    });

    if (topbarTitle) topbarTitle.textContent = feature.screen.topbar;

    // 대시보드 탭일 때는 하단 내비의 활성 항목도 바꾼다
    const activeNavLabel = feature.id === "dashboard" ? "홈" : "채팅";
    navItems.forEach((item) => {
      item.classList.toggle("is-active", item.textContent.trim().endsWith(activeNavLabel));
    });

    fillMeters(detailWrap.querySelector(`#feature-detail-${id}`));
  };

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-feature]");
    if (tab) select(tab.dataset.feature);
  });

  // ← → Home End 키 이동
  tabList.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const tabs = $$(".features__tab", tabList);
    const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");

    let next = current;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;

    event.preventDefault();
    select(tabs[next].dataset.feature);
    tabs[next].focus();
  });

  /* 5. 게이지 채우기 — 처음 보일 때, 그리고 탭을 바꿀 때마다 */
  function fillMeters(panel) {
    if (!panel) return;
    $$("[data-metric]", panel).forEach((row) => {
      const fill = row.querySelector(".meter__fill");
      if (!fill) return;
      fill.style.width = "0%";
      // 다음 프레임에 값을 넣어야 transition 이 걸린다
      requestAnimationFrame(() => {
        fill.style.width = `${Math.min(Number(row.dataset.metric) || 0, 100)}%`;
      });
    });
  }

  onceInView(detailWrap, () => fillMeters(detailWrap.querySelector(".features__detail.is-active")), {
    threshold: 0.2,
  });
}
