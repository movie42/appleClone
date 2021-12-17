(function () {
  let currentScene = 0;
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageAOpacity: [0, 1],
      },
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function scrollYSetHandler() {
    let scrollY = window.scrollY;
    return { scrollY };
  }

  function setIdInBody() {
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function prevScrollHeightHandler() {
    let prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    return { prevScrollHeight };
  }

  function animationOpacityHandler() {
    const values = sceneInfo[currentScene].values;
    let messageAOpacityStart = values.messageAOpacity[0];
    let messageAOpacityEnd = values.messageAOpacity[1];
    return {
      messageAOpacityStart,
      messageAOpacityEnd,
    };
  }

  function calcValues() {
    let rv;
    const { prevScrollHeight } = prevScrollHeightHandler();
    const { scrollY } = scrollYSetHandler();
    const currentScrollYHeight = scrollY - prevScrollHeight;

    let scrollRatio =
      currentScrollYHeight / sceneInfo[currentScene].scrollHeight;

    const { messageAOpacityStart, messageAOpacityEnd } =
      animationOpacityHandler();

    rv =
      scrollRatio * (messageAOpacityEnd - messageAOpacityStart) +
      messageAOpacityStart;

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;

    switch (currentScene) {
      case 0:
        let messageAOpacityFadeIn = calcValues();
        objs.messageA.style.opacity = messageAOpacityFadeIn;
        objs.messageB.style.opacity = messageAOpacityFadeIn;
        objs.messageC.style.opacity = messageAOpacityFadeIn;
        objs.messageD.style.opacity = messageAOpacityFadeIn;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop() {
    const { prevScrollHeight } = prevScrollHeightHandler();
    const { scrollY } = scrollYSetHandler();
    if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      setIdInBody();
    }

    if (scrollY < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
      setIdInBody();
    }

    playAnimation();
  }

  function scrollEventHandler() {
    let { scrollY } = scrollYSetHandler();
    scrollLoop();
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    let totalScrollHeight = 0;

    const { scrollY } = scrollYSetHandler();

    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      if (totalScrollHeight >= scrollY) {
        currentScene = i;
        break;
      }
    }

    setIdInBody();
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", scrollEventHandler);
})();
