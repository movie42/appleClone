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
  function currentSceneHandler(totalScrollHeight, scrollY) {
    let currentScene = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      if (totalScrollHeight >= scrollY) {
        currentScene = i;
        break;
      }
    }
    return currentScene;
  }

  // 전체 높이
  function totalScrollHeightHandler(func = "") {
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].sceneHeight;
    }
    if (!func) return totalScrollHeight;
    if (typeof func === "function") return func(totalScrollHeight);
  }

  // 현재 스크롤 위치
  function scrollHeightHandler(func = "") {
    let currentScrollHeight = window.scrollY;
    if (!func) return currentScrollHeight;
    if (typeof func === "function") return func(currentScrollHeight);
  }

  function prevScrollHeightHandler(currentScene) {
    let prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    return func(prevScrollHeight);
  }

  function setIdInBody(currentScene) {
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].sceneHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].sceneHeight}px`;
    }
  }

  function scrollEventHandler() {
    const totalScrollHeight = totalScrollHeightHandler();
    const scrollHeight = scrollHeightHandler();
    let currentScene = currentSceneHandler(totalScrollHeight, scrollHeight);
    console.log(currentScene);
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", scrollEventHandler);

  function scrollLoop() {
    // let startScene = false;
    // const { prevScrollHeight } = prevScrollHeightHandler();
    // const { scrollY } = scrollYSetHandler();
    // if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
    //   currentScene++;
    //   startScene = true;
    //   setIdInBody();
    // }
    // if (scrollY < prevScrollHeight) {
    //   if (currentScene === 0) return;
    //   startScene = true;
    //   currentScene--;
    //   setIdInBody();
    // }
    // if (currentScene) return;
    // playAnimation();
  }

  // // animation opacity handler는 opacity만 변경해준다.
  // function animationOpacityHandler() {
  //   const values = sceneInfo[currentScene].values;

  //   let messageAOpacityStart = values.messageAOpacityIn[0];
  //   let messageAOpacityEnd = values.messageAOpacityIn[1];

  //   return {
  //     messageAOpacityStart,
  //     messageAOpacityEnd,
  //   };
  // }

  // function calcValues() {
  //   let rv;
  //   const values = sceneInfo[currentScene].values.messageAOpacityIn;

  //   const { prevScrollHeight } = prevScrollHeightHandler();
  //   const { scrollY } = scrollYSetHandler();

  //   const currentScrollYHeight = scrollY - prevScrollHeight;

  //   const scrollHeight = sceneInfo[currentScene].scrollHeight;
  //   const scrollRatio = currentScrollYHeight / scrollHeight;

  //   const { messageAOpacityStart, messageAOpacityEnd } =
  //     animationOpacityHandler();

  //   if (values.length === 3) {
  //     const partScrollStart = values[2].start * scrollHeight;
  //     const partScrollEnd = values[2].end * scrollHeight;
  //     const partScrollHeight = partScrollEnd - partScrollStart;

  //     if (
  //       currentScrollYHeight >= partScrollStart &&
  //       currentScrollYHeight <= partScrollEnd
  //     ) {
  //       rv =
  //         ((currentScrollYHeight - partScrollStart) / partScrollHeight) *
  //           (messageAOpacityEnd - messageAOpacityStart) +
  //         messageAOpacityStart;
  //     } else if (currentScrollYHeight < partScrollStart) {
  //       rv = values[0];
  //     } else if (currentScrollYHeight > partScrollEnd) {
  //       rv = values[1];
  //     }
  //   } else {
  //     rv =
  //       scrollRatio * (messageAOpacityEnd - messageAOpacityStart) +
  //       messageAOpacityStart;
  //   }

  //   return rv;
  // }

  // function playAnimation() {
  //   const objs = sceneInfo[currentScene].objs;

  //   switch (currentScene) {
  //     case 0:
  //       let messageAOpacityFadeIn = calcValues();
  //       // let messageAOpacityFadeOut = calcValues();
  //       objs.messageA.style.opacity = messageAOpacityFadeIn;
  //       // objs.messageA.style.opacity = messageAOpacityFadeOut;
  //       // objs.messageB.style.opacity = messageAOpacityFadeIn;
  //       // objs.messageC.style.opacity = messageAOpacityFadeIn;
  //       // objs.messageD.style.opacity = messageAOpacityFadeIn;
  //       break;
  //     case 1:
  //       break;
  //     case 2:
  //       break;
  //     case 3:
  //       break;
  //   }
  // }
})();
