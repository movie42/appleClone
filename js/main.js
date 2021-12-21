import { map } from "./$.js";

(function () {
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        // messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        // messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        // messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.35 }],
        // messageBOpacity: [0, 1, { start: 0.3, end: 0.4 }],
        // messageCOpacity: [0, 1, { start: 0.5, end: 0.6 }],
        // messageDOpacity: [0, 1, { start: 0.7, end: 0.8 }],
      },
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  // currentScene
  // 따지고 보면 currentScene 는 전역변수가 아니다.

  let currentScene = 0;

  function prevScrollHeightHandler() {
    let scrollCurrentHeight = scrollHeightHandler();
    let prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].sceneHeight;
    }

    if (
      scrollCurrentHeight >
      prevScrollHeight + sceneInfo[currentScene].sceneHeight
    ) {
      currentScene++;
    }

    if (scrollCurrentHeight < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
    }

    return prevScrollHeight;
  }

  // 전체 높이
  function totalScrollHeightHandler() {
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].sceneHeight;
    }
    return totalScrollHeight;
  }

  // 현재 스크롤 위치
  function scrollHeightHandler() {
    let currentScrollHeight = window.scrollY;
    return currentScrollHeight;
  }

  function setIdInBody(currentScene) {
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function scrollEventHandler() {
    const prevScrollHeight = prevScrollHeightHandler();
    setIdInBody(currentScene);
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    map(sceneInfo, (value) => {
      value.sceneHeight = value.heightNum * window.innerHeight;
      value.objs.container.style.height = `${value.sceneHeight}px`;
    });

    scrollEventHandler();
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", scrollEventHandler);
})();
