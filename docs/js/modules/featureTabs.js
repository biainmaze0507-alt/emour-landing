/**
 * js/modules/featureTabs.js
 * ---------------------------------------------------------------------------
 * 핵심 기능 3종 — 탭 목록 · 실제 화면 · 근거 패널을 한 번에 만든다.
 *
 * 화면은 폰 목업 안에 넣지 않는다. 히어로의 대화 창과 똑같이
 * 윤곽선(.chat-window) 하나로만 감싼다. 그래서
 *   · 디자인 토큰을 바꾸면 이 화면도 같이 바뀌고
 *   · 텍스트를 화면에서 그대로 읽을 수 있으며(접근성 · SEO)
 *   · 좁은 화면에서 폰 껍데기 때문에 내용이 눌리지 않는다.
 *
 * 접근성: role="tablist" / "tab" / "tabpanel" 규약을 지키고
 *        ← → Home End 키로 이동할 수 있다.
 */

import { FEATURES } from "../data/features.js";
import { icon } from "../data/icons.js";
import { $, $$, el, escapeHtml, onceInView } from "./utils.js";
import { bubbleRow, donutSvg, flowSvg, suggestionChips } from "./render.js";
import { getEmotion } from "../data/emotions.js";

/* --------------------------------------------------------------------------
   화면 껍데기 — 상단바 + 본문(+ 입력창)
   -------------------------------------------------------------------------- */

/** 앱 상단바 — 뒤로 · 제목 · 검색 (앱의 ChatHeader와 같은 구성) */
function windowHead(title) {
  return el("div", {
    className: "chat-window__head",
    html: `
      <span class="chat-window__head-icon">${icon("chevronLeft", 20)}</span>
      <span class="chat-window__head-info">
        <span class="chat-window__name">${escapeHtml(title)}</span>
      </span>
      <span class="chat-window__head-icon">${icon("search", 20)}</span>
    `,
  });
}

/** 앱 입력창 — 사진 추가 · 입력 · 교정 · 전송 (앱의 ChatInputBar와 같은 구성) */
function windowComposer() {
  return el("div", {
    className: "chat-window__composer",
    attrs: { "aria-hidden": "true" },
    html: `
      <span class="chat-window__composer-icon">${icon("imagePlus", 20)}</span>
      <span class="chat-window__composer-field">
        <span class="chat-window__composer-text">메시지를 입력하세요</span>
        <span class="chat-window__correct">${icon("wand", 13)}<span>교정</span></span>
      </span>
      <span class="chat-window__send">${icon("send", 17)}</span>
    `,
  });
}

/* --------------------------------------------------------------------------
   화면 내용 3종
   -------------------------------------------------------------------------- */

/** kind: "chat" — 말풍선만 */
function screenChat(screen) {
  const body = el("div", { className: "chat-window__body" });
  body.append(el("p", { className: "chat-window__divider", text: "오늘" }));
  screen.rows.forEach((row) => body.append(bubbleRow(row)));
  return [body, windowComposer()];
}

/** kind: "suggest" — 말풍선 + 문장 다듬기 추천 칩 */
function screenSuggest(screen) {
  const body = el("div", { className: "chat-window__body" });
  screen.rows.forEach((row) => body.append(bubbleRow(row)));

  const suggests = el("div", { className: "chat-window__suggests" });
  suggests.append(suggestionChips(screen.suggests));

  return [body, suggests, windowComposer()];
}

/** kind: "dashboard" — 통계 타일 + 도넛 + 흐름 그래프 */
function screenDashboard(screen) {
  const body = el("div", { className: "chat-window__body chat-window__body--pad" });

  body.append(
    el("div", {
      className: "report__period",
      html: `<span>주간</span><b>${escapeHtml(screen.period)}</b>`,
    })
  );

  // 상단 3칸
  const stats = el("div", { className: "report__stats" });
  screen.stats.forEach((stat) => {
    stats.append(
      el("div", {
        html: `<b>${escapeHtml(stat.value)}</b><span>${escapeHtml(stat.label)}</span>`,
      })
    );
  });
  body.append(stats);

  // 도넛 + 범례 (범례는 상위 5개만 — 좁은 폭에 다 넣으면 읽히지 않는다)
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
      className: "report__card",
      html: `
        <span class="report__card-title">주간 채팅 감정 분포 비율</span>
        <span class="report__card-sub">어떤 감정이 얼마나 오갔는지 모아봤어요</span>
        <div class="report__donut">
          ${donutSvg(screen.donut, { size: 100, thickness: 17 })}
          <ul class="report__legend">${legendItems}</ul>
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
        className: "report__card",
        html: `
          <span class="report__card-title">기록된 기분 흐름</span>
          <span class="report__card-sub">하루 중 어느 시간에 마음이 오르내렸는지 이어봤어요</span>
          <div class="report__flow">${flowSvg(screen.flow)}</div>
          <div class="report__axis">${axis}</div>
          <div class="report__flow-legend">
            <span><i style="--tone: var(--emotion-positive)"></i>긍정</span>
            <span><i style="--tone: var(--emotion-negative)"></i>부정</span>
          </div>
        `,
      })
    );
  }

  // 하단 요약 2칸
  const footer = el("div", { className: "report__footer" });
  screen.footer.forEach((item) => {
    footer.append(
      el("div", {
        html: `<span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b>`,
      })
    );
  });
  body.append(footer);

  return [body];
}

const SCREEN_RENDERERS = {
  chat: screenChat,
  suggest: screenSuggest,
  dashboard: screenDashboard,
};

/** 기능 하나의 화면 전체를 만든다. */
function featureScreen(feature) {
  const { screen } = feature;
  const render = SCREEN_RENDERERS[screen.kind];
  if (!render) return null;

  return el("div", {
    className: "chat-window",
    attrs: { "data-panel": feature.id },
    children: [windowHead(screen.topbar), ...render(screen)],
  });
}

/* --------------------------------------------------------------------------
   근거 패널
   -------------------------------------------------------------------------- */
function detailPanel(feature, index) {
  const { detail } = feature;

  const points = detail.points
    .map((point) => `<li class="features__point">${escapeHtml(point)}</li>`)
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
    `,
  });
}

/* --------------------------------------------------------------------------
   초기화
   -------------------------------------------------------------------------- */
export function initFeatureTabs() {
  const tabList = $(".features__tabs");
  const screenWrap = $(".features__screen-wrap");
  const detailWrap = $(".features__details");

  if (!tabList || !screenWrap || !detailWrap) return;

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

  /* 2. 화면 — 세 개를 겹쳐 두고 하나만 보여 준다 */
  FEATURES.forEach((feature, index) => {
    const screen = featureScreen(feature);
    if (!screen) return;
    if (index === 0) screen.classList.add("is-active");
    screenWrap.append(screen);
  });

  /* 3. 근거 패널 */
  FEATURES.forEach((feature, index) => detailWrap.append(detailPanel(feature, index)));

  /* 4. 전환 */
  const select = (id) => {
    if (!FEATURES.some((f) => f.id === id)) return;

    $$(".features__tab", tabList).forEach((tab) => {
      const on = tab.dataset.feature === id;
      tab.setAttribute("aria-selected", String(on));
      tab.setAttribute("tabindex", on ? "0" : "-1");
    });

    $$("[data-panel]", screenWrap).forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === id);
    });

    $$(".features__detail", detailWrap).forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `feature-detail-${id}`);
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
}
