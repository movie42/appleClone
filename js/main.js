import { map, filter } from "./$.js";

(function () {
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0")
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.35 }]
        // messageBOpacity: [0, 1, { start: 0.3, end: 0.4 }],
        // messageCOpacity: [0, 1, { start: 0.5, end: 0.6 }],
        // messageDOpacity: [0, 1, { start: 0.7, end: 0.8 }],
      }
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1")
      }
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2")
      }
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3")
      }
    }
  ];

  // currentScene
  // 독립적이지 않다... 평가 시점이 중요함 어떻게 독립적으로 만들 수 있지?

  function prevScrollHeightAndCurrentSceneHandler(
    currentScrollHeight
  ) {
    let currentScene = 0;
    let prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].sceneHeight;
    }

    if (
      currentScrollHeight >
      prevScrollHeight + sceneInfo[currentScene].sceneHeight
    ) {
      currentScene++;
    }

    if (currentScrollHeight < prevScrollHeight) {
      if (currentScene === 0) return;
      currentScene--;
    }

    return { currentScene, prevScrollHeight };
  }

  // current scene가 정해져야하기 때문에 평가시점 중요함
  function setIdInBody(currentScene) {
    return document.body.setAttribute(
      "id",
      `show-scene-${currentScene}`
    );
  }

  function currentSceneHeightHandler(currentScene) {
    return sceneInfo[currentScene].sceneHeight;
  }

  function sectionList() {
    return document.querySelectorAll("section") !== null
      ? document.querySelectorAll("section")
      : null;
  }

  function currentSceneNodeList(currentScene, func) {
    const nodeList =
      sectionList()[currentScene].querySelectorAll(".main-message") ||
      null;
    if (arguments.length < 2) {
      return nodeList;
    }
    return func(nodeList, currentScene);
  }

  // 전체 높이
  // 레이어아웃 함수가 만들어졌다면 평가시점이 중요하지 않음. 어디서든 불러와도 된다.
  function totalScrollHeightHandler() {
    let totalScrollHeight = 0;

    filter(
      sceneInfo,
      (value) => (totalScrollHeight += value.sceneHeight)
    );

    return totalScrollHeight;
  }

  // 현재 스크롤 위치
  // 평가 시점 중요하지 않음, 언제든지 불러와도 가능함.
  function scrollHeightHandler(func = "") {
    let currentScrollHeight = window.scrollY;
    if (typeof arguments[0] === "function")
      return func(currentScrollHeight);
    return currentScrollHeight;
  }

  function fadeInHandler({ node, height }, start, end) {
    let fadeIn = [0, 1];
    const currentScrollHeight = scrollHeightHandler();
    const { prevScrollHeight } = scrollHeightHandler(
      prevScrollHeightAndCurrentSceneHandler
    );

    let remainHeight = currentScrollHeight - prevScrollHeight;

    console.log(remainHeight);

    let startTime = start * height;
    let endTime = end * height;

    // console.log(remainHeight / height, startTime, endTime);

    node.style.opacity = "1";
  }
  function fadeOutHandler(node, start, end) {}

  // 성능이 저하될 가능성이 있음... (message가 1000개 10000개가 된다고 생각하면 분명...)
  function nodeAnimationHandler(nodeList, currentScene) {
    let eachNodeAnimationValues = map(nodeList, (node) => ({
      node,
      height: sceneInfo[currentScene].sceneHeight
    }));
    return eachNodeAnimationValues;
  }

  function scrollEventHandler() {
    const totalScrollHeight = totalScrollHeightHandler();

    let currentScrollHeight = scrollHeightHandler();
    let { currentScene, prevScrollHeight } =
      prevScrollHeightAndCurrentSceneHandler(currentScrollHeight);

    console.log(currentScene, prevScrollHeight);

    setIdInBody(currentScene);

    let nodeAnimationValueObjs = currentSceneNodeList(
      currentScene,
      (nodeList, currentScene) =>
        nodeAnimationHandler(nodeList, currentScene)
    );

    switch (currentScene) {
      case 0:
        fadeInHandler(nodeAnimationValueObjs[0], 0.1, 0.2);
        fadeOutHandler(nodeAnimationValueObjs[0], 0.3, 0.4);
        break;
      case 1:
        console.log("scene 1");
        break;
      case 2:
        // fadeInHandler(nodeAnimationValueObjs[0], 0.1, 0.2);
        // fadeInOutHandler(nodeAnimationValueObjs);
        console.log("scene 2");
        break;

      case 3:
        // fadeInOutHandler(nodeAnimationValueObjs);
        break;
    }
  }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅 평가시점 중요하지 않음.
    map(sceneInfo, (value) => {
      value.sceneHeight = value.heightNum * window.innerHeight;
      value.objs.container.style.height = `${value.sceneHeight}px`;
    });

    scrollEventHandler();
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", scrollEventHandler);

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
