/**
 * js/modules/render.js
 * ---------------------------------------------------------------------------
 * 여러 곳에서 똑같이 그려지는 조각들 — 감정 태그와 말풍선.
 * 히어로 대화(heroChat)와 기능 목업(featureTabs)이 같은 함수를 쓰기 때문에
 * 한쪽만 모양이 달라지는 일이 생기지 않는다.
 */

import { getEmotion } from "../data/emotions.js";
import { icon } from "../data/icons.js";
import { el, escapeHtml } from "./utils.js";

/**
 * 감정 태그 — 말풍선 위에 붙는 작은 칩.
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
  const wrap = el("div", { className: `bubble-row bubble-row--${row.side}` });

  // 1) 감정 태그 줄 — 분석 중이면 스피너, 감정이 있으면 태그
  if (row.analyzing) {
    wrap.append(
      el("span", {
        className: "analyzing",
        html: `<i class="analyzing__spinner"></i><span>AI 감정 분석 중</span>`,
      })
    );
  } else if (row.emotion) {
    wrap.append(emotionTag(row.emotion, { pop: Boolean(row.pop) }));
  }

  // 2) 말풍선
  const bubble = el("p", {
    className: "bubble",
    text: row.empty ? "" : row.text,
  });
  wrap.append(bubble);

  // 3) 시간 · 읽음
  if (row.time || row.read) {
    const meta = el("span", { className: "bubble-meta" });
    if (row.read) meta.append(el("b", { className: "bubble-meta__read", text: "읽음" }));
    if (row.time) meta.append(el("span", { text: row.time }));
    wrap.append(meta);
  }

  // 타이핑 등에서 다시 찾기 쉽도록 참조를 달아 둔다
  wrap._bubble = bubble;
  return wrap;
}

/**
 * 도넛 차트 SVG.
 * conic-gradient 대신 SVG stroke 로 그린다 — 조각마다 접근성 이름을 붙일 수 있고,
 * 조각 사이 간격(gap)을 정확히 제어할 수 있기 때문이다.
 *
 * @param {Array<{code:string, pct:number}>} slices  합이 100 이 되도록 넣는다
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

/**
 * 감정 흐름 그래프 — 하루를 2시간 단위로 끊은 긍정 / 부정 곡선.
 * 좁은 그래프에서는 15색을 다 쓸 수 없으므로 극성 요약색 2개만 쓴다.
 *
 * @param {{positive:number[], negative:number[], hours:string[]}} flow
 * @param {object} [opts] width / height
 */
export function flowSvg(flow, { width = 300, height = 84 } = {}) {
  const { positive = [], negative = [] } = flow;
  const count = Math.max(positive.length, negative.length);
  if (count < 2) return "";

  const max = Math.max(1, ...positive, ...negative);
  const padY = 8;
  const stepX = width / (count - 1);

  // 값 배열 → "x,y x,y …" 좌표 문자열
  const points = (values) =>
    values
      .map((value, index) => {
        const x = index * stepX;
        const y = height - padY - (value / max) * (height - padY * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const line = (values, token, dash) =>
    `<polyline points="${points(values)}" fill="none" stroke="var(${token})" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

  // 긍정 곡선 아래는 옅게 채워 "좋았던 시간"이 면적으로 읽히게 한다
  const area =
    `<polygon points="0,${height} ${points(positive)} ${width},${height}" ` +
    `fill="var(--emotion-positive)" opacity="0.14"/>`;

  return (
    `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" ` +
    `aria-label="하루 감정 흐름 그래프 — 2시간 단위 긍정 · 부정 추이">` +
    `${area}${line(positive, "--emotion-positive")}${line(negative, "--emotion-negative", "3 3")}</svg>`
  );
}
