// 그냥 따라만들기
// scroll animation의 컨셉 이해하기
// canvas 공부하기
// 스크롤 애니메이션 프레임 워크를 만들기 전에 기본적인 컨셉을 이해하기
window.onload = (function () {
  let scrollY = 0; // window.scrollY
  let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화 된 scene 번호
  let enterNewScene = false; // 새로운 씬이 시작된 순간 true
  const sceneInfo = [
    {
      // 0
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      type: "sticky",
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d")
      },
      values: {
        messageAOpacity: [0, 1, { start: 0, end: 0.2 }]
      }
    },
    {
      // 1
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      type: "normal",
      objs: {
        container: document.querySelector("#scroll-section-1")
      },
      values: {}
    },
    {
      // 2
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      type: "sticky",
      objs: {
        container: document.querySelector("#scroll-section-2")
      },
      values: {}
    },
    {
      // 3
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      type: "sticky",
      objs: {
        container: document.querySelector("#scroll-section-3")
      },
      values: {}
    }
  ];

  function calcValues(values, currentScrollY) {
    let rv;
    // 현재 스크롤 섹션에서 스크롤 비율
    let scrollRatio = currentScrollY / sceneInfo[currentScene].scrollHeight;

    rv = scrollRatio * (values[1] - values[0]) + values[0];

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    let currentSceneScrollY = scrollY - prevScrollHeight;
    switch (currentScene) {
      case 0:
        let messageAOpacityFadeIn = calcValues(values.messageAOpacity, currentSceneScrollY);
        objs.messageA.style.opacity = messageAOpacityFadeIn;

        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    // 초기 show-scene을 currentScnene에 따라 body에 설정하기 위한 코드
    let totalScrollHeight = 0;
    scrollY = window.scrollY;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      if (totalScrollHeight >= scrollY) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  // debounce Resize시 매번 불러오지 않기 위해서
  function debounce(func, limit = 100, leading = false) {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;

      let callNow = leading && !!inDebounce;

      const later = () => {
        inDebounce = null;
        if (!leading) func.apply(context, args);
      };

      clearTimeout(inDebounce);
      inDebounce = setTimeout(later, limit);

      if (callNow) func.apply(context, args);
    };
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // prevScrollHeight 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (scrollY < prevScrollHeight) {
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) {
      return;
    }

    playAnimation();
  }

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    scrollLoop();
  });
  window.addEventListener("resize", debounce(setLayout, 500, true));
  window.addEventListener("load", setLayout);
})();
