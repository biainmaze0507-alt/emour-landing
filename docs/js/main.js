/**
 * js/main.js
 * ---------------------------------------------------------------------------
 * 진입점. 각 섹션 모듈을 순서대로 켠다.
 *
 * 순서가 중요한 부분
 *   1) initReveal() 이 먼저 돌아야 window.__emourObserveReveal 이 준비된다.
 *      (뒤에서 JS 로 만든 [data-reveal] 요소를 등록할 때 쓴다)
 *   2) 나머지는 서로 독립적이라 순서가 바뀌어도 된다.
 *
 * 모듈 하나가 실패해도 나머지 섹션은 살아 있도록 각각 try 로 감싼다.
 */

import { initNav } from "./modules/nav.js";
import { initReveal, initCursorGlow, initMagnetic } from "./modules/reveal.js";
import { initHeroChat } from "./modules/heroChat.js";
import { initWhy } from "./modules/why.js";
import { initFeatureTabs } from "./modules/featureTabs.js";
import { initEmotionGrid } from "./modules/emotionGrid.js";
import { initFilm } from "./modules/film.js";
import { initProof, initHeroFacts } from "./modules/proof.js";
import { initFeedback } from "./modules/feedbackCards.js";
import { initArchitecture } from "./modules/architecture.js";
import { initIdentity } from "./modules/identity.js";
import { initTeam } from "./modules/team.js";
import { renderFooter, renderYear } from "./modules/footer.js";

/** 이름을 붙여 실행 — 어느 모듈에서 났는지 콘솔에 남긴다. */
function run(name, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[Emour landing] ${name} 초기화 실패`, error);
  }
}

function boot() {
  // 1) 등장 연출 기반 먼저
  run("reveal", initReveal);

  // 2) 뼈대
  run("nav", initNav);
  run("footer", renderFooter);
  run("year", renderYear);

  // 3) 섹션
  run("heroChat", initHeroChat);
  run("heroFacts", initHeroFacts);
  run("why", initWhy);
  run("features", initFeatureTabs);
  run("emotions", initEmotionGrid);
  run("film", initFilm);
  run("proof", initProof);
  run("feedback", initFeedback);
  run("architecture", initArchitecture);
  run("identity", initIdentity);
  run("team", initTeam);

  // 4) 장식 (포인터 기기에서만 동작)
  run("cursorGlow", initCursorGlow);
  run("magnetic", initMagnetic);

  document.documentElement.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
