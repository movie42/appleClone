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
        messageAOpacityIn: [0, 1, { start: 0.05, end: 0.15 }],
        messageAOpacityOut: [1, 0, { start: 0.2, end: 0.25 }],
        messageATranslateYIn: [20, 0, { start: 0.05, end: 0.15 }],
        messageATranslateYOut: [0, -20, { start: 0.2, end: 0.25 }],

        messageBOpacityIn: [0, 1, { start: 0.25, end: 0.35 }],
        messageBOpacityOut: [1, 0, { start: 0.4, end: 0.45 }],
        messageBTranslateYIn: [20, 0, { start: 0.25, end: 0.35 }],
        messageBTranslateYOut: [0, -20, { start: 0.4, end: 0.45 }],

        messageCOpacityIn: [0, 1, { start: 0.45, end: 0.55 }],
        messageCOpacityOut: [1, 0, { start: 0.6, end: 0.75 }],
        messageCTranslateYIn: [20, 0, { start: 0.45, end: 0.55 }],
        messageCTranslateYOut: [0, -20, { start: 0.6, end: 0.75 }],

        messageDOpacityIn: [0, 1, { start: 0.75, end: 0.85 }],
        messageDOpacityOut: [1, 0, { start: 0.9, end: 0.95 }],
        messageDTranslateYIn: [20, 0, { start: 0.75, end: 0.85 }],
        messageDTranslateYOut: [0, -20, { start: 0.9, end: 0.95 }]
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
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentScrollY / scrollHeight;

    if (values.length === 3) {
      // start end 사이에서 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (partScrollStart <= currentScrollY && partScrollEnd >= currentScrollY) {
        rv =
          ((currentScrollY - partScrollStart) / partScrollHeight) * (values[1] - values[0]) +
          values[0];
      } else if (partScrollStart > currentScrollY) {
        rv = values[0];
      } else if (partScrollEnd < currentScrollY) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    let currentSceneScrollY = scrollY - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;

    const scrollRatio = currentSceneScrollY / scrollHeight;

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.2) {
          let messageAOpacityFadeIn = calcValues(values.messageAOpacityIn, currentSceneScrollY);
          let messageATranslateYIn = calcValues(values.messageATranslateYIn, currentSceneScrollY);
          objs.messageA.style.opacity = messageAOpacityFadeIn;
          objs.messageA.style.transform = `translateY(${messageATranslateYIn}%)`;
        } else {
          let messageAOpacityFadeOut = calcValues(values.messageAOpacityOut, currentSceneScrollY);
          let messageATranslateYOut = calcValues(values.messageATranslateYOut, currentSceneScrollY);
          objs.messageA.style.opacity = messageAOpacityFadeOut;
          objs.messageA.style.transform = `translateY(${messageATranslateYOut}%)`;
        }

        if (scrollRatio <= 0.35) {
          let messageBOpacityFadeIn = calcValues(values.messageBOpacityIn, currentSceneScrollY);
          let messageBTranslateYIn = calcValues(values.messageBTranslateYIn, currentSceneScrollY);

          objs.messageB.style.opacity = messageBOpacityFadeIn;
          objs.messageB.style.transform = `translateY(${messageBTranslateYIn}%)`;
        } else {
          let messageBOpacityFadeOut = calcValues(values.messageBOpacityOut, currentSceneScrollY);
          let messageBTranslateYOut = calcValues(values.messageBTranslateYOut, currentSceneScrollY);
          objs.messageB.style.opacity = messageBOpacityFadeOut;
          objs.messageB.style.transform = `translateY(${messageBTranslateYOut}%)`;
        }

        if (scrollRatio <= 0.55) {
          let messageCOpacityFadeIn = calcValues(values.messageCOpacityIn, currentSceneScrollY);
          let messageCTranslateYIn = calcValues(values.messageCTranslateYIn, currentSceneScrollY);

          objs.messageC.style.opacity = messageCOpacityFadeIn;
          objs.messageC.style.transform = `translateY(${messageCTranslateYIn}%)`;
        } else {
          let messageCOpacityFadeOut = calcValues(values.messageCOpacityOut, currentSceneScrollY);
          let messageCTranslateYOut = calcValues(values.messageCTranslateYOut, currentSceneScrollY);
          objs.messageC.style.opacity = messageCOpacityFadeOut;
          objs.messageC.style.transform = `translateY(${messageCTranslateYOut}%)`;
        }

        if (scrollRatio <= 0.85) {
          let messageDOpacityFadeIn = calcValues(values.messageDOpacityIn, currentSceneScrollY);
          let messageDTranslateYIn = calcValues(values.messageDTranslateYIn, currentSceneScrollY);
          objs.messageD.style.opacity = messageDOpacityFadeIn;
          objs.messageD.style.transform = `translateY(${messageDTranslateYIn}%)`;
        } else {
          let messageDOpacityFadeOut = calcValues(values.messageDOpacityOut, currentSceneScrollY);
          let messageDTranslateYOut = calcValues(values.messageDTranslateYOut, currentSceneScrollY);
          objs.messageD.style.opacity = messageDOpacityFadeOut;
          objs.messageD.style.transform = `translateY(${messageDTranslateYOut}%)`;
        }
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
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.clientHeight;
      }
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
