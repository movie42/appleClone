(() => {
  let yOffset = 0;
  let prevScrollSection = 0;
  let currentScene = 0;
  let enterNewScene = false;

  const sceneInfo = [
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector(
          "#scroll-section-0 .main-message.a"
        ),
        messageB: document.querySelector(
          "#scroll-section-0 .main-message.b"
        ),
        messageC: document.querySelector(
          "#scroll-section-0 .main-message.c"
        ),
        messageD: document.querySelector(
          "#scroll-section-0 .main-message.d"
        )
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        messageATranslateIn: [20, 0, { start: 0.1, end: 0.2 }],
        messageATranslateOut: [0, -20, { start: 0.25, end: 0.3 }],
        messageBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        messageBOpacityOut: [1, 0, { start: 0.45, end: 0.5 }],
        messageBTranslateIn: [20, 0, { start: 0.3, end: 0.4 }],
        messageBTranslateOut: [0, -20, { start: 0.45, end: 0.5 }],
        messageCOpacityIn: [0, 1, { start: 0.5, end: 0.6 }],
        messageCOpacityOut: [1, 0, { start: 0.65, end: 0.7 }],
        messageCTranslateIn: [20, 0, { start: 0.5, end: 0.6 }],
        messageCTranslateOut: [0, -20, { start: 0.65, end: 0.7 }],
        messageDOpacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        messageDOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        messageDTranslateIn: [20, 0, { start: 0.7, end: 0.8 }],
        messageDTranslateOut: [0, -20, { start: 0.85, end: 0.9 }]
      }
    },
    {
      type: "normal",
      // heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1")
      }
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin")
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.3, end: 0.35 }],
        messageATranslateYIn: [20, 0, { start: 0.15, end: 0.2 }],
        messageATranslateYOut: [0, -20, { start: 0.3, end: 0.35 }],

        messageBOpacityIn: [0, 1, { start: 0.4, end: 0.45 }],
        messageBOpacityOut: [1, 0, { start: 0.5, end: 0.6 }],
        messageBTranslateYIn: [20, 0, { start: 0.4, end: 0.45 }],
        messageBTranslateYOut: [0, -20, { start: 0.5, end: 0.6 }],
        pinBScaleYIn: [0, 100, { start: 0.4, end: 0.45 }],

        messageCOpacityIn: [0, 1, { start: 0.65, end: 0.7 }],
        messageCOpacityOut: [1, 0, { start: 0.8, end: 0.9 }],
        messageCTranslateYIn: [20, 0, { start: 0.65, end: 0.7 }],
        messageCTranslateYOut: [0, -20, { start: 0.8, end: 0.9 }],
        pinCScaleYIn: [0, 100, { start: 0.65, end: 0.7 }]
      }
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3")
      }
    }
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅

    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight =
          sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        console.dir(sceneInfo[i].objs.container);
        sceneInfo[i].scrollHeight =
          sceneInfo[i].objs.container.scrollHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.scrollY;

    let totalSetLayout = 0;

    for (let i = 0; i < sceneInfo.lengths; i++) {
      totalSetLayout += sceneInfo[i].scrollHeight;

      if (totalSetLayout >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    if (values.length === 3) {
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

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollSection;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityIn,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageATranslateIn,
            currentYOffset
          )}%)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityOut,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageATranslateOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.42) {
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityIn,
            currentYOffset
          );
          objs.messageB.style.transform = `translateY(${calcValues(
            values.messageBTranslateIn,
            currentYOffset
          )}%)`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityOut,
            currentYOffset
          );
          objs.messageB.style.transform = `translateY(${calcValues(
            values.messageBTranslateOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.62) {
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityIn,
            currentYOffset
          );
          objs.messageC.style.transform = `translateY(${calcValues(
            values.messageCTranslateIn,
            currentYOffset
          )}%)`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityOut,
            currentYOffset
          );
          objs.messageC.style.transform = `translateY(${calcValues(
            values.messageCTranslateOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.82) {
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityIn,
            currentYOffset
          );
          objs.messageD.style.transform = `translateY(${calcValues(
            values.messageDTranslateIn,
            currentYOffset
          )}%)`;
        } else {
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityOut,
            currentYOffset
          );
          objs.messageD.style.transform = `translateY(${calcValues(
            values.messageDTranslateOut,
            currentYOffset
          )}%)`;
        }
        break;

      case 2:
        if (scrollRatio <= 0.32) {
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityIn,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageATranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityOut,
            currentYOffset
          );
          objs.messageA.style.transform = `translateY(${calcValues(
            values.messageATranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.52) {
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityIn,
            currentYOffset
          );
          objs.messageB.style.transform = `translateY(${calcValues(
            values.messageBTranslateYIn,
            currentYOffset
          )}%)`;
          objs.pinB.style.transform = `scaleY(${calcValues(
            values.pinBScaleYIn,
            currentYOffset
          )}%`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityOut,
            currentYOffset
          );
          objs.messageB.style.transform = `translateY(${calcValues(
            values.messageBTranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.72) {
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityIn,
            currentYOffset
          );
          objs.messageC.style.transform = `translateY(${calcValues(
            values.messageCTranslateYIn,
            currentYOffset
          )}%)`;
          objs.pinC.style.transform = `scaleY(${calcValues(
            values.pinCScaleYIn,
            currentYOffset
          )}%`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityOut,
            currentYOffset
          );
          objs.messageC.style.transform = `translateY(${calcValues(
            values.messageCTranslateYOut,
            currentYOffset
          )}%)`;
        }
        break;
      case 3:
        console.log("current4");
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollSection = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollSection += sceneInfo[i].scrollHeight;
    }
    if (
      yOffset >
      prevScrollSection + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollSection) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  window.addEventListener("scroll", () => {
    yOffset = window.scrollY;
    scrollLoop();
  });
  window.addEventListener("resize", setLayout);
  window.addEventListener("load", setLayout);
})();
