/**
 * js/modules/film.js
 * ---------------------------------------------------------------------------
 * 소개 영상 플레이어.
 *
 * 영상 파일은 12MB 가량이라 처음부터 내려받으면 첫 화면이 느려진다.
 * 그래서 preload="none" 으로 두고, 재생 버튼을 누른 순간에 로드한다.
 * (덮개는 이미지가 아니라 CSS 그라데이션 + 로고라 추가 요청이 없다)
 */

import { icon } from "../data/icons.js";
import { $ } from "./utils.js";

/** 초 → "0:42" */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function initFilm() {
  const frame = $(".film__frame");
  const video = $(".film__video");
  if (!frame || !video) return;

  const playBtn = $(".film__play", frame);
  const toggleBtn = $("[data-film-toggle]", frame);
  const muteBtn = $("[data-film-mute]", frame);
  const fullBtn = $("[data-film-full]", frame);
  const bar = $(".film__bar", frame);
  const barFill = $(".film__bar-fill", frame);
  const time = $(".film__time", frame);

  /* 아이콘 주입 */
  if (playBtn) playBtn.innerHTML = icon("play", 26);
  if (toggleBtn) toggleBtn.innerHTML = icon("play", 15);
  if (muteBtn) muteBtn.innerHTML = icon("volumeOff", 15);
  if (fullBtn) fullBtn.innerHTML = icon("maximize", 15);

  // 소리는 처음엔 꺼 둔다 — 자동재생 정책과 무관하게 사용자를 놀라게 하지 않기 위해
  video.muted = true;

  const start = () => {
    frame.classList.add("is-playing");
    // 첫 재생에서만 소리를 켠다(사용자 조작으로 시작하므로 브라우저가 허용한다)
    video.muted = false;
    if (muteBtn) muteBtn.innerHTML = icon("volume", 15);
    video.play().catch(() => {
      // 소리를 켠 재생이 막히면 음소거로 되돌려 다시 시도한다
      video.muted = true;
      if (muteBtn) muteBtn.innerHTML = icon("volumeOff", 15);
      video.play().catch(() => {});
    });
  };

  playBtn?.addEventListener("click", start);

  /* 재생 / 일시정지 */
  toggleBtn?.addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });

  video.addEventListener("play", () => {
    frame.classList.add("is-playing");
    if (toggleBtn) toggleBtn.innerHTML = icon("pause", 15);
  });

  video.addEventListener("pause", () => {
    if (toggleBtn) toggleBtn.innerHTML = icon("play", 15);
  });

  video.addEventListener("ended", () => {
    frame.classList.remove("is-playing");
    video.currentTime = 0;
    if (barFill) barFill.style.width = "0%";
  });

  /* 음소거 */
  muteBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = icon(video.muted ? "volumeOff" : "volume", 15);
    muteBtn.setAttribute("aria-label", video.muted ? "소리 켜기" : "소리 끄기");
  });

  /* 전체화면 */
  fullBtn?.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else frame.requestFullscreen?.().catch(() => {});
  });

  /* 진행 상태 */
  video.addEventListener("timeupdate", () => {
    const ratio = video.duration ? video.currentTime / video.duration : 0;
    if (barFill) barFill.style.width = `${ratio * 100}%`;
    if (time) time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  video.addEventListener("loadedmetadata", () => {
    if (time) time.textContent = `0:00 / ${formatTime(video.duration)}`;
  });

  /* 막대를 눌러 이동 */
  bar?.addEventListener("click", (event) => {
    if (!video.duration) return;
    const rect = bar.getBoundingClientRect();
    video.currentTime = ((event.clientX - rect.left) / rect.width) * video.duration;
  });

  /* 화면 밖으로 나가면 자동으로 멈춘다 — 스크롤을 내렸는데 소리만 나는 상황 방지 */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) video.pause();
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(frame);
  }
}
