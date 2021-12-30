import { map, filter } from "./$.js";

(function () {
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      sceneHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document
          .querySelector("#video-canvas-0")
          .getContext("2d"),
        videoImages: []
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }]
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
  let currentScene = 0;

  function prevScrollHeightAndCurrentSceneHandler(
    currentScrollHeight
  ) {
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

  function sectionList() {
    return document.querySelectorAll("section") !== null
      ? document.querySelectorAll("section")
      : null;
  }

  // undefined일때... 완전 망가짐...
  function currentSceneNodeList(currentScene, func) {
    const nodeList =
      sectionList()[currentScene].querySelectorAll(".main-message");
    if (arguments.length < 2) {
      return nodeList !== null ? nodeList : null;
    }
    return nodeList !== null ? func(nodeList, currentScene) : null;
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

  function fadeInOutHandler({ node, height }, { start, mid, end }) {
    const currentScrollHeight = scrollHeightHandler();
    const { prevScrollHeight } = scrollHeightHandler(
      prevScrollHeightAndCurrentSceneHandler
    );

    let remainHeight = currentScrollHeight - prevScrollHeight;

    let startTime = start * height;
    let midTime = mid * height;
    let endTime = end * height;

    if (remainHeight >= startTime && remainHeight <= midTime) {
      node.style.opacity =
        (remainHeight - startTime) / (midTime - startTime);
    } else if (remainHeight < startTime) {
      node.style.opacity = 0;
    } else if (remainHeight === midTime) {
      node.style.opacity = 1;
    } else if (remainHeight > midTime && remainHeight <= endTime) {
      node.style.opacity -=
        (remainHeight - midTime) / (endTime - midTime);
    } else if (remainHeight > endTime) {
      node.style.opacity = 0;
    }
  }

  function translateYHandler({ node, height }, { start, mid, end }) {
    const currentScrollHeight = scrollHeightHandler();
    const { prevScrollHeight } = scrollHeightHandler(
      prevScrollHeightAndCurrentSceneHandler
    );

    let remainHeight = currentScrollHeight - prevScrollHeight;

    let startTime = start * height;
    let midTime = mid * height;
    let endTime = end * height;

    if (remainHeight >= startTime && remainHeight <= midTime) {
      node.style.transform = `translateY(${
        ((remainHeight - startTime) / (endTime - startTime)) * -20
      }%)`;
    } else if (remainHeight < startTime) {
      node.style.transform = `translateY(0)`;
    } else if (remainHeight === midTime) {
      node.style.transform = `translateY(-20%)`;
    } else if (remainHeight > midTime && remainHeight <= endTime) {
      node.style.transform = `translateY(${
        ((remainHeight - startTime) / (endTime - startTime)) * -20
      }%)`;
    } else if (remainHeight > endTime) {
      node.style.transform = `translateY(-40%)`;
    }
  }

  // 성능이 저하될 가능성이 있음... (message가 1000개 10000개가 된다고 생각하면 분명...)
  function nodeAnimationHandler(nodeList, currentScene) {
    let eachNodeAnimationValues = map(nodeList, (node) => ({
      node,
      height: sceneInfo[currentScene].sceneHeight
    }));
    return eachNodeAnimationValues;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].sceneHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function scrollEventHandler() {
    let currentScrollHeight = scrollHeightHandler();
    let { currentScene, prevScrollHeight } =
      prevScrollHeightAndCurrentSceneHandler(currentScrollHeight);

    setIdInBody(currentScene);

    let nodeAnimationValueObjs = currentSceneNodeList(
      currentScene,
      (nodeList, currentScene) =>
        nodeAnimationHandler(nodeList, currentScene)
    );

    let remainHeight = currentScrollHeight - prevScrollHeight;

    switch (currentScene) {
      case 0:
        let sequence = Math.round(
          calcValues(sceneInfo[0].values.imageSequence, remainHeight)
        );

        sceneInfo[0].objs.context.drawImage(
          sceneInfo[0].objs.videoImages[sequence],
          0,
          0
        );

        sceneInfo[0].objs.canvas.style.opacity = calcValues(
          sceneInfo[0].values.canvas_opacity,
          remainHeight
        );

        fadeInOutHandler(nodeAnimationValueObjs[0], {
          start: 0.1,
          mid: 0.2,
          end: 0.3
        });
        translateYHandler(nodeAnimationValueObjs[0], {
          start: 0.1,
          mid: 0.2,
          end: 0.3
        });
        fadeInOutHandler(nodeAnimationValueObjs[1], {
          start: 0.3,
          mid: 0.4,
          end: 0.5
        });
        translateYHandler(nodeAnimationValueObjs[1], {
          start: 0.3,
          mid: 0.4,
          end: 0.5
        });
        fadeInOutHandler(nodeAnimationValueObjs[2], {
          start: 0.5,
          mid: 0.6,
          end: 0.7
        });
        translateYHandler(nodeAnimationValueObjs[2], {
          start: 0.5,
          mid: 0.6,
          end: 0.7
        });
        fadeInOutHandler(nodeAnimationValueObjs[3], {
          start: 0.7,
          mid: 0.8,
          end: 0.9
        });
        translateYHandler(nodeAnimationValueObjs[3], {
          start: 0.7,
          mid: 0.8,
          end: 0.9
        });
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

  function setCanvasImage() {
    let imageElement;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imageElement = document.createElement("img");
      imageElement.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imageElement);
    }
  }

  setCanvasImage();

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅 평가시점 중요하지 않음.
    map(sceneInfo, (value) => {
      if (value.type === "sticky") {
        value.sceneHeight = value.heightNum * window.innerHeight;
        value.objs.container.style.height = `${value.sceneHeight}px`;
      }
    });

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;

    scrollEventHandler();
  }

  window.addEventListener("load", () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(
      sceneInfo[0].objs.videoImages,
      0,
      0
    );
  });
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", scrollEventHandler);
})();
