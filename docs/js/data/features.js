/**
 * js/data/features.js
 * ---------------------------------------------------------------------------
 * 핵심 기능 3종. 탭 하나가 { 탭 버튼, 목업 화면, 오른쪽 근거 } 를 모두 정의한다.
 *
 * screen 은 목업 안에 그려질 내용의 "설계도"다.
 * 실제 DOM 은 js/modules/featureTabs.js 의 renderScreen() 이 만든다.
 *   kind: "chat"      말풍선 목록 (rows)
 *   kind: "suggest"   말풍선 + 답장 추천 카드
 *   kind: "dashboard" 도넛 + 통계 타일
 */

export const FEATURES = [
  {
    id: "analysis",
    icon: "messageCircle",
    title: "채팅 감정 분석",
    short: "주고받는 문장마다 감정이 붙습니다",

    detail: {
      kicker: "Feature 01",
      title: "말끝의 온도까지 읽어내는 문맥 기반 분석",
      body:
        "메시지 한 줄만 따로 보면 “그래, 네 마음대로 해.”는 그저 동의입니다. " +
        "Emour 는 직전 대화를 함께 넣어 분석하기 때문에, 같은 문장이 언제 서운함이 되는지를 구분합니다.",
      points: [
        "직전 대화 최대 10건을 문맥으로 함께 전달해 같은 문장의 다른 의미를 잡아냅니다.",
        "메시지를 하나씩이 아니라 묶음(최대 10건)으로 요청해 분석 지연을 줄였습니다.",
        "모델이 이상하게 답해도 응답 개수는 항상 요청 개수와 일치하도록 안전장치를 두었습니다.",
        "결과는 백엔드 EmotionType 15종 열거형으로만 저장되어 화면·통계가 어긋나지 않습니다.",
      ],
      metrics: [
        { label: "감정 라벨", value: "15종", pct: 100 },
        { label: "감정 분석 결과가 절반 이상 일치했다는 응답", value: "66.7%", pct: 66.7 },
        { label: "감정 라벨 및 아이콘 이해도", value: "4.40 / 5", pct: 88 },
      ],
    },

    screen: {
      kind: "chat",
      topbar: "연인",
      rows: [
        { side: "yours", text: "우리 여행 숙소 있잖아", emotion: "CURIOSITY", time: "오후 9:54" },
        { side: "mine", text: "응 내가 예약해뒀어", emotion: "COMFORT", time: "오후 10:02", read: true },
        { side: "yours", text: "거기 말고 다른 데는 안 돼?", emotion: "WORRY", time: "오후 10:05" },
        { side: "mine", text: "그래 네 마음대로 해", emotion: "HURT", time: "오후 10:07", read: true, analyzing: true },
      ],
    },
  },

  {
    id: "reply",
    icon: "wand",
    title: "채팅 답장 추천",
    short: "지금 상황에 맞는 세 가지 말투를 제안합니다",

    detail: {
      kicker: "Feature 02",
      title: "무슨 말을 해야 할지 모를 때, 세 갈래로 열어 둡니다",
      body:
        "정답을 하나 던지지 않습니다. 문제를 풀 것인지, 마음을 먼저 받을 것인지, " +
        "부드럽게 넘길 것인지 — 고르는 일은 결국 사람의 몫이기 때문입니다.",
      points: [
        "해결형 · 공감형 · 상냥하게 세 가지 화행(speech act)으로 나누어 제안합니다.",
        "직전 대화 맥락과 상대의 감정 분석 결과를 함께 넣어 문장을 생성합니다.",
        "추천 문장은 입력창에 채워지기만 하고, 보내는 것은 언제나 사용자가 결정합니다.",
        "교정 버튼으로 이미 쓴 문장을 다듬을 수도 있습니다.",
      ],
      metrics: [
        { label: "상냥하게 — 화행 일치율", value: "90.9%", pct: 90.9 },
        { label: "공감형 — 화행 일치율", value: "81.8%", pct: 81.8 },
        { label: "해결형 — 화행 일치율", value: "72.7%", pct: 72.7 },
      ],
    },

    screen: {
      kind: "suggest",
      topbar: "연인",
      rows: [
        { side: "yours", text: "이번 주말엔 혼자 쉬고 싶어", emotion: "DISTRESS", time: "오후 10:10" },
        { side: "mine", text: "그래도 우리 한 달 전부터 약속한 데이트잖아…", emotion: "SADNESS", time: "오후 10:10", read: true },
        { side: "yours", text: "미안해 근데 이번 주는 진짜 안 될 것 같아", emotion: "APOLOGY", time: "오후 10:10" },
      ],
      suggests: [
        { kind: "해결형", text: "알겠어, 그럼 다음엔 언제 괜찮을지 알려줄래?" },
        { kind: "공감형", text: "많이 힘든가 보네, 괜찮아?" },
        { kind: "상냥하게", text: "그래, 네가 쉬고 싶으면 그렇게 해도 돼" },
      ],
    },
  },

  {
    id: "dashboard",
    icon: "clipboard",
    title: "대시보드",
    short: "쌓인 대화를 둘의 기록으로 되돌려 줍니다",

    detail: {
      kicker: "Feature 03",
      title: "지나간 대화가 돌아볼 수 있는 기록이 됩니다",
      body:
        "감정은 한 번 붙고 끝나지 않습니다. 일 · 주 · 월 단위로 모아 두면 " +
        "“요즘 우리 대화가 어땠지”를 말이 아니라 그림으로 확인할 수 있습니다.",
      points: [
        "주간 채팅 감정 분포를 나와 상대로 나누어 도넛 차트로 보여줍니다.",
        "집계할 감정을 직접 골라 원하는 감정만 따로 볼 수 있습니다.",
        "하루를 2시간 단위로 끊어 긍정 · 중립 · 부정 흐름을 그래프로 그립니다.",
        "가장 활발했던 시간대, 평균 답장 시간, 사진 · 공감 수까지 함께 기록됩니다.",
      ],
      metrics: [
        { label: "무드 트래커 · 감정 분포 · 대화 흐름", value: "3종 리포트", pct: 100 },
        { label: "집계 단위", value: "일 · 주 · 월", pct: 80 },
        { label: "지인 추천 의향", value: "7.29 / 10", pct: 72.9 },
      ],
    },

    screen: {
      kind: "dashboard",
      topbar: "대시보드",
      period: "8월 9일 ~ 15일",
      // 발표 자료의 주간 리포트 실제 화면 값 그대로
      stats: [
        { value: "39", label: "메시지" },
        { value: "1", label: "사진" },
        { value: "0", label: "공감" },
      ],
      donut: [
        { code: "SADNESS", pct: 25 },
        { code: "NEUTRAL", pct: 20 },
        { code: "EXCITEMENT", pct: 10 },
        { code: "WORRY", pct: 10 },
        { code: "JOY", pct: 10 },
        { code: "COMFORT", pct: 10 },
        { code: "SURPRISE", pct: 5 },
        { code: "SHYNESS", pct: 5 },
        { code: "CURIOSITY", pct: 5 },
      ],
      /**
       * 감정 흐름 — 하루를 2시간 단위(0·2·4 … 22시)로 끊은 12개 값.
       * 극성별 메시지 수이며, 0~10 범위의 예시 값이다.
       */
      flow: {
        hours: ["0시", "6시", "12시", "18시", "24시"],
        positive: [0, 0, 1, 2, 1, 3, 5, 6, 4, 7, 8, 5],
        negative: [1, 0, 0, 1, 3, 2, 1, 0, 2, 1, 0, 0],
      },

      footer: [
        { label: "가장 활발했던 시간", value: "밤 8시 ~ 밤 9시" },
        { label: "평균 답장 시간", value: "1시간 8분" },
      ],
    },
  },
];
