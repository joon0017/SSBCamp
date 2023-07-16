# JavaScript
## JavaScript 란?
Html이 웹페이지의 내용, CSS가 웹페이지의 스타일을 담당한다면, JavaScript는 웹페이지의 동작을 담당한다.
자바스크립트도 CSS와 동일하게 HTML 문서 내부에 `<script>` 태그를 사용하여 적용시키거나, 외부의 JavaScript 파일을 HTML 문서에 연결시켜서 적용시킬 수 있다.
```html
<html>
    <head>
        <script>
            alert("Hello World!");
        </script>
    </head>
    <body>
        ...
    </body>
</html>
```
외부 JavaScript 파일을 HTML 문서에 연결시키기 위해서는, `<script>` 태그를 안에, ```src="파일 또는 링크"```를 사용한다.
```html
<html>
    <head>
        <script src="script.js"></script>
    </head>
    <body>
        ...
    </body>
</html>
```

## JavaScript 기본 문법
### 변수
변수는 값을 저장하는 공간이다. 변수를 선언할 때는 `let` 키워드를 사용한다.
```javascript
let a = 1;
```
let는 따로 타입을 지정해주지 않아도 된다.

### 상수
상수는 값을 바꿀 수 없는 변수이다. 상수를 선언할 때는 `const` 키워드를 사용한다.
```javascript
const a = 1;
```

### 데이터 타입
자바스크립트의 데이터 타입은 크게 두 가지로 나뉜다.
- 기본형
- 참조형

#### 기본형
기본형은 변수에 담긴 값을 그대로 복사하는 데이터 타입이다.
- Number
- String
- Boolean
- 등등

#### 참조형
참조형은 변수에 담긴 값이 저장된 주소를 복사하는 데이터 타입이다.
- Object
- Array
- Function
- 등등


## HTML 제어 예시

자바스크립트를 사용하여, 문서 내에 각각 요소들을 제어할 수 있다.
```html
<html>
    <head>
        <script>
            function changeColor() {
                document.getElementById("text").style.color = "red";
            }
        </script>
    </head>
    <body>
        <p id="text">Hello World!</p>
        <button onclick="changeColor()">Click!</button>
    </body>
</html>
```
위의 예시는 버튼을 클릭하면, id가 text인 요소의 글자 색을 빨간색으로 바꾸는 예시이다.

이 외에도, 한 태그 안에 있는 내용, 속성 등을 제어 할 수도 있다.

[돌아가기](/README.md)
