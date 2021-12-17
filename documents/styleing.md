# 메뉴 스타일링

## 학습 노트

이번에 애플 사이트 클론을 하면서 CSS 다시 한번 복습해보았다.
그리고 그냥 직관적으로 따라 썼던 선택자나 상대 크기 개념을 찾아봤다.

## px, em, rem, vh, vw

보통 px은 고정, em과 rem은 상대 크기로 사용했었다. html에 px로 기준이 되는 폰트 사이즈를 적용한 다음에 기준 사이즈에 몇 배를 키우거나 줄이기 위해 사용했다. 하지만 정확한 개념을 몰랐기 때문에 찾아보았다.

1. 상속

px, em, rem을 알기 전에 css의 상속을 알아야한다. c상속은 부모가 가진 속성 값을 자식도 물려받는 것을 말한다. 예를 들어 부모의 높이가 24px이면 자식의 높이도 24px을 상속받을 수 있다. height는 %단위가 적용되지 않을 때가 많은데 부모가 높이를 가지지 않기 때문일 수 있다. 어쨌든 부모가 고정 크기를 가지고 있으면 자식도 그 크기를 물려받을 수 있다.

```css
html {
  height: 24px;
}

body {
  height: 100%;
}
```

위에 코드처럼 작성하면 body는 html의 높이를 상속받기 때문에 body의 hegiht는 24px이 된다. 그밖에 오늘 공부한 글자 크기도 상속의 개념에서 시작된다고 볼 수 있다.

2. px
   px은 고정 크기다. 내가 적용하고 싶은 길이나 높이 등을 px 값을 입력하면 고정 크기가 된다. 반응형 웹을 개발할 때 가변을 대응해야하기 때문에 px을 사용하는 것은 적절하지 않을 수 있다.

3. em
   em은 자기 자신의 글자 크기의 px을 참조하여 상대 크기를 계산한다. em은 자기 자신을 참조하는 크기다.

```css
html {
  font-size: 14px;
}

body {
  font-size: 28px;
}

body .container {
  font-size: 2em;
}
```

글자 크기가 body가 28px로 고정이 되어있기 때문에 body의 자녀인 .container는 28px을 상속받는다. em은 상속받은 크기의 상대 크기를 의미하기 때문에 .container의 글자 크기는 56px이다. em은 자기 자신의 크기가 무엇인지를 보고 상대 크기를 계산한다.

다른 속성에도 em을 적용할 수 있는데 역시 글자 크기를 기준으로 em이 계산된다.

만약에 .container 안에 다른 자녀를 만들고 그 안에 너비를 em으로 입력하면 어떻게 될까?

```css
body .container {
  font-size: 2em;
}

body .container .child {
  width: 2em;
}
```

정답은 56px 두 배 값을 출력하게 된다. em은 자기 자신의 글자 크기를 참조하기 때문이다. 만약 이렇게 설계를 하면 자기 자신의 상대 크기의 상대 크기를 출력하기 때문에 의도하던것과 다른 크기를 얻게 될 수 도 있다.

4. rem
   rem은 오직 html의 글자 크기를 상속한다. 만약 위의 코드에서 .container의 글자 크기를 rem으로 할 경우 html의 14px의 크기의 상대 크기를 계산하기 때문에 .container의 글자 크기는 28px이 된다. 기준을 html로 삼기 때문에 width나 height의 값도 rem을 사용하면 html의 글자 크기를 기준으로 값을 계산해 출력하게 된다.

5. vh, vw
   vh, vw는 뷰포트의 넓이와 높이다. viewport는 브라우저의 현재 넓이와 높이 값이라고 볼 수 있다. 따라서 vh, vw는 현재 내가 열어 놓은 브라우저의 viewport의 넢이와 높이의 상대 크기를 의미한다. 만약에 vh와 vw를 100으로 입력할 경우 브라우저의 넢이와 높이를 그대로 사용한다는 의미가 된다.

   %를 쓰지 않고 vh, vw를 사용할 때 장점은 %는 부모 요소의 상속을 받기 때문에 내가 의도한대로 넓이와 높이가 출력되지 않을 가능성이 있기 때문이다.

## 마무리

em은 자기 자신의 크기를 참조하고 %는 부모의 크기를 상속받아 계산한다. rem은 html의 글자 크기를 참조하여 상대 크기를 계산하고 vh, vw는 브라우저 크기를 참조해 상대 크기를 계산한다.

> 참고
> [WATCHA 개발 지식 — px | em | rem](https://medium.com/watcha/watcha-%EA%B0%9C%EB%B0%9C-%EC%A7%80%EC%8B%9D-px-em-rem-f569c6e76e66)  
> [브라우저 뷰포트 (layout 와 visual viewport) 간단 정리하기](https://pks2974.medium.com/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%B7%B0%ED%8F%AC%ED%8A%B8-layout-%EC%99%80-visual-viewport-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-47756d5ee3cf)  
> [CSS의 7가지 단위 - rem, vh, vw, vmin, vmax, ex, ch : [Web Club]](https://webclub.tistory.com/356)
