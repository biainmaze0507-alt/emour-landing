/**
 * js/shared/render.js
 * ---------------------------------------------------------------------------
 * 여러 곳에서 똑같이 그려지는 조각들 — 감정 태그 · 말풍선 · 추천 칩 · 차트.
 *
 * 말풍선 구조는 앱의 components/chat/MessageBubble을 그대로 옮겼다.
 *
 *   .chat-row                       가로 한 줄. 내 메시지는 row-reverse
 *   ├ .chat-row__column             감정 태그와 말풍선을 세로로 쌓는 칸
 *   │ ├ .emotion-tag / .analyzing   말풍선 위에 붙는 꼬리표
 *   │ └ .chat-bubble                말풍선
 *   └ .chat-row__meta               읽음 · 시간 (말풍선 옆에 세로로)
 *
 * 히어로 대화(heroChat)와 기능 화면(featureTabs)이 같은 함수를 쓰기 때문에
 * 한쪽만 모양이 달라지는 일이 생기지 않는다.
 */

import { getEmotion } from "../data/emotions.js";
import { icon } from "../data/icons.js";
import { el, escapeHtml } from "./utils.js";

/**
 * 감정 태그 — 말풍선 위에 붙는 작은 표기.
 * @param {string} code   감정 코드 (예: "HURT")
 * @param {object} [opts] pop: 등장 애니메이션 여부
 */
export function emotionTag(code, { pop = false } = {}) {
  const emotion = getEmotion(code);
  return el("span", {
    className: `emotion-tag${pop ? " emotion-tag--pop" : ""}`,
    html: `${icon(emotion.icon, 12)}<span>${escapeHtml(emotion.label)}</span>`,
    style: { "--tone": `var(${emotion.token})` },
  });
}

/** "AI 감정 분석 중" 꼬리표 — 감정 태그가 붙기 전 자리를 대신 지킨다. */
export function analyzingTag() {
  return el("span", {
    className: "analyzing",
    html: `<i class="analyzing__spinner"></i><span>AI 감정 분석 중</span>`,
  });
}

/**
 * 말풍선 한 줄.
 * @param {object} row
 *   side      "mine" | "yours"
 *   text      본문
 *   emotion   감정 코드 (없으면 태그를 붙이지 않는다)
 *   time      "오후 10:07"
 *   read      읽음 표시 여부
 *   analyzing 분석 중 표시 여부 (감정 태그 대신 스피너)
 *   empty     본문을 비워 두고 나중에 타이핑으로 채울 때 true
 */
export function bubbleRow(row) {
  const wrap = el("div", { className: `chat-row chat-row--${row.side}` });
  const column = el("div", { className: "chat-row__column" });

  // 1) 꼬리표 — 분석 중이면 스피너, 감정이 있으면 태그
  if (row.analyzing) {
    column.append(analyzingTag());
  } else if (row.emotion) {
    column.append(emotionTag(row.emotion, { pop: Boolean(row.pop) }));
  }

  // 2) 말풍선
  const bubble = el("p", {
    className: "chat-bubble",
    text: row.empty ? "" : row.text,
  });
  column.append(bubble);
  wrap.append(column);

  // 3) 읽음 · 시간 — 말풍선 옆에 세로로 쌓인다
  wrap.append(metaColumn(row));

  // 타이핑 등에서 다시 찾기 쉽도록 참조를 달아 둔다
  wrap._bubble = bubble;
  wrap._column = column;
  return wrap;
}

/** 읽음 · 시간 칸. 값이 없으면 빈 칸으로 두어 줄 높이가 흔들리지 않게 한다. */
export function metaColumn({ read = false, time = "" } = {}) {
  const meta = el("div", { className: "chat-row__meta" });
  if (read) meta.append(el("b", { className: "chat-row__read", text: "읽음" }));
  if (time) meta.append(el("span", { className: "chat-row__time", text: time }));
  return meta;
}

/**
 * 문장 다듬기 추천 묶음 — 앱의 SuggestionChips와 같은 구조.
 *
 * 랜딩에서는 눌러도 아무 일이 일어나지 않으므로 <button> 이 아니라 표시로 둔다.
 * 누를 수 있어 보이는 것은 누를 수 있어야 한다. 같은 이유로
 * "탭하면 입력창에 반영돼요" 안내도 두지 않는다.
 *
 * @param {Array<{kind:string, text:string}>} items
 * @param {object} [opts] stagger: 칩마다 등장 지연을 줄지 여부
 */
export function suggestionChips(items, { stagger = false } = {}) {
  const wrap = el("div", { className: "suggests" });

  wrap.append(
    el("p", {
      className: "suggests__title",
      html: `${icon("sparkles", 13)}<span>문장 다듬기 추천</span>`,
    })
  );

  const row = el("div", { className: "suggests__row" });
  items.forEach((item, index) => {
    row.append(
      el("span", {
        className: "suggests__chip",
        html:
          `<b class="suggests__chip-kind">${escapeHtml(item.kind)}</b>` +
          `<span>${escapeHtml(item.text)}</span>`,
        style: stagger ? { "animation-delay": `${index * 70}ms` } : undefined,
      })
    );
  });
  wrap.append(row);


  return wrap;
}

/**
 * 도넛 차트 SVG.
 * conic-gradient 대신 SVG stroke로 그린다 — 조각마다 접근성 이름을 붙일 수 있고,
 * 조각 사이 간격(gap)을 정확히 제어할 수 있기 때문이다.
 *
 * @param {Array<{code:string, pct:number}>} slices  합이 100이 되도록 넣는다
 * @param {object} [opts] size / thickness / gap(도)
 */
export function donutSvg(slices, { size = 100, thickness = 16, gap = 1.6 } = {}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;
  const segments = slices
    .map((slice) => {
      const emotion = getEmotion(slice.code);
      const length = (slice.pct / 100) * circumference;
      const visible = Math.max(length - (gap / 360) * circumference, 0.5);
      const dash = `${visible} ${circumference - visible}`;
      const dashOffset = -offset;
      offset += length;

      return (
        `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" ` +
        `stroke="var(${emotion.token})" stroke-width="${thickness}" ` +
        `stroke-dasharray="${dash}" stroke-dashoffset="${dashOffset}" ` +
        `stroke-linecap="butt"><title>${escapeHtml(emotion.label)} ${slice.pct}%</title></circle>`
      );
    })
    .join("");

  return (
    `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="감정 분포 도넛 차트">` +
    `<g transform="rotate(-90 ${center} ${center})">${segments}</g></svg>`
  );
}

/* --------------------------------------------------------------------------
   기록된 기분 흐름 — 실제 화면의 MoodTrendChart와 같은 그래프
   -------------------------------------------------------------------------- */

/** 그래프 자리 — 뷰박스와 여백은 실제 화면과 같은 값이다. */
const FLOW = {
  width: 320,
  height: 150,
  pad: { top: 14, right: 12, bottom: 26, left: 30 },
  gridLines: 5,
  dot: 3.2,
  /** 기분 5단 — 아래가 나쁨, 위가 좋음 */
  scale: { min: 1, max: 5, minLabel: "나쁨", maxLabel: "좋음" },
};

/**
 * 두 사람이 남긴 기분 기록을 하루 24시간 위에 잇는다.
 *
 * 기록이 없는 시간은 점을 만들지 않고 다음 점과 바로 이어진다 —
 * 하루에 두세 번 남기는 기록이라 빈 시간을 0으로 눕히면 없던 기분이 생긴다.
 * 선은 Catmull-Rom을 3차 베지어로 바꿔 부드럽게 그린다.
 *
 * @param {{mine:{at:number,mood:number}[], partner:{at:number,mood:number}[], hours:number[]}} flow
 */
export function flowSvg(flow) {
  const { width, height, pad, gridLines, dot, scale } = FLOW;
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const bottom = pad.top + plotHeight;

  // 하루 전체가 가로축이다. 기록이 몰려 있어도 축은 0시부터 24시까지 그대로 둔다.
  const dayMinutes = 24 * 60;
  const x = (minute) => pad.left + (minute / dayMinutes) * plotWidth;
  const y = (mood) =>
    pad.top + ((scale.max - mood) / (scale.max - scale.min)) * plotHeight;

  const project = (points = []) =>
    points.map((point) => ({ cx: x(point.at), cy: y(point.mood) }));

  const series = [
    { key: "mine", label: "나", token: "--color-primary", points: project(flow.mine) },
    { key: "partner", label: "상대방", token: "--emotion-surprise", dashed: true, points: project(flow.partner) },
  ].filter((line) => line.points.length > 0);

  if (series.length === 0) return "";

  const grid = Array.from({ length: gridLines }, (_, index) => {
    const value = scale.min + ((scale.max - scale.min) * index) / (gridLines - 1);
    return (
      `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y(value)}" y2="${y(value)}" ` +
      `stroke="var(--color-divider)" stroke-width="1"/>`
    );
  }).join("");

  const label = (text, atY) =>
    `<text x="4" y="${atY + 4}" fill="var(--color-text-tertiary)" font-size="8" font-weight="700">${text}</text>`;

  const ticks = flow.hours
    .map((hour, index) => {
      const anchor = index === 0 ? "start" : index === flow.hours.length - 1 ? "end" : "middle";
      return (
        `<text x="${x(hour * 60)}" y="${height - 8}" text-anchor="${anchor}" ` +
        `fill="var(--color-text-tertiary)" font-size="8" font-weight="700">${hour}시</text>`
      );
    })
    .join("");

  // 면은 첫 시리즈에만 깐다. 둘 다 채우면 서로 가린다.
  const [primary] = series;
  const area =
    primary.points.length > 1
      ? `<path d="${smoothPath(primary.points)} L ${primary.points.at(-1).cx} ${bottom} ` +
        `L ${primary.points[0].cx} ${bottom} Z" fill="url(#flow-area)" stroke="none"/>`
      : "";

  // 뒤 시리즈부터 그려서 '나'가 위에 온다
  const lines = [...series]
    .reverse()
    .map((line) =>
      line.points.length > 1
        ? `<path d="${smoothPath(line.points)}" fill="none" stroke="var(${line.token})" ` +
          `stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"` +
          `${line.dashed ? ' stroke-dasharray="4 3"' : ""}/>`
        : ""
    )
    .join("");

  const dots = series
    .map((line) =>
      line.points
        .map(
          (point) =>
            `<circle cx="${point.cx}" cy="${point.cy}" r="${dot}" fill="var(${line.token})" ` +
            `stroke="var(--color-surface)" stroke-width="1.6"/>`
        )
        .join("")
    )
    .join("");

  return (
    `<svg viewBox="0 0 ${width} ${height}" role="img" ` +
    `aria-label="기록된 기분 흐름 — 하루 24시간 동안 두 사람이 남긴 기분">` +
    `<defs><linearGradient id="flow-area" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0%" stop-color="var(${primary.token})" stop-opacity="0.2"/>` +
    `<stop offset="100%" stop-color="var(${primary.token})" stop-opacity="0"/>` +
    `</linearGradient></defs>` +
    `${grid}${label(scale.maxLabel, y(scale.max))}${label(scale.minLabel, y(scale.min))}` +
    `${area}${lines}${dots}${ticks}</svg>`
  );
}

/**
 * Catmull-Rom 스플라인을 3차 베지어로 바꿔 부드러운 곡선을 만든다.
 * 장력 1/6이라 점을 그대로 지나면서도 과하게 출렁이지 않는다.
 */
function smoothPath(points) {
  const round = (value) => Math.round(value * 100) / 100;
  let path = `M ${round(points[0].cx)} ${round(points[0].cy)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.cx + (p2.cx - p0.cx) / 6;
    const c1y = p1.cy + (p2.cy - p0.cy) / 6;
    const c2x = p2.cx - (p3.cx - p1.cx) / 6;
    const c2y = p2.cy - (p3.cy - p1.cy) / 6;

    path += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.cx)} ${round(p2.cy)}`;
  }

  return path;
}
