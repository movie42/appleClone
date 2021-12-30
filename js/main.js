// 그냥 따라만들기
// scroll animation의 컨셉 이해하기
// canvas 공부하기
// 일단 프레임 워크처럼 동작하는 함수 만들기 전에 기본적인 컨셉을 이해하기
window.onload = (function () {
  let scrollY = 0; // window.scrollY
  let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화 된 scene 번호
  const sceneInfo = [
    {
      // 0
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      type: "sticky",
      objs: {
        container: document.querySelector("#scroll-section-0")
      },
      values: {}
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

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  }

  // debounce Resize시 매번 불러오지 않기 위해서
  function debounce(func, limit = 100, leading = false) {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      console.log(context, args);
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
    prevScrollHeight = 0; // prevScrollHeight 초기화
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
    }
    if (scrollY < prevScrollHeight) {
      currentScene--;
    }
    console.log(currentScene);
  }

  window.addEventListener("resize", debounce(setLayout, 500, true));
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    scrollLoop();
  });
  window.addEventListener("load", setLayout);
})();
