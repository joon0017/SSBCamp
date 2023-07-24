# Jquery
## 1. Jquery란?
### 1-1 Jquery 개요
Jquery는 JavaScript를 이용하여 동적인 웹페이지를 쉽게 만들 수 있도록 도와주는 라이브러리입니다. 자바스크립트의 사용을 매우 간단하게 해주며, 배우는것도 쉽습니다.

```html
<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
<script>
$(document).ready(function(){
  $("p").click(function(){
    $(this).hide();
  });
});
</script>
</head>
<body>

<p>If you click on me, I will disappear.</p>
<p>Click me away!</p>
<p>Click me too!</p>

</body>
</html>
```

ajax 라이브러리를 이용하여, jquery를 사용할 수 있습니다.
이 코드를 분석해보면, `$(document).ready(function){}`은, 해당 html 문서가 로드 될 때 실행되는 함수입니다. 이 함수 없이 코드를 작성하면, html 문서가 로딩이 다 안된 상태에서 jquery 코드가 실행될 수 있기 때문에, 추가해 주는 것이 좋습니다. `$("p")`는 p 태그를 의미하며, `click()`은 클릭 이벤트를 의미합니다. `$(this)`는 해당 이벤트가 발생한 객체를 의미합니다. `hide()`는 해당 객체를 숨깁니다. 즉, 이 모든것을 합치면 p 태그, `<p>` 안에 있는 내용이 클릭되면, 해당 태그가 숨겨지는 코드입니다.

jquery가 아니라 자바스크립트로 이 코드를 구현하면 다음과 같습니다.
```javascript
document.addEventListener("DOMContentLoaded", function() {
    var p = document.getElementsByTagName("p");
    for (var i = 0; i < p.length; i++) {
        p[i].addEventListener("click", function() {
            this.style.display = "none";
        });
    }
});
```
이 코드를 보면, jquery를 사용한 코드보다 훨씬 길고, 이해하기 어렵습니다. 이처럼 jquery는 자바스크립트를 쉽게 사용할 수 있도록 도와줍니다.

### 1-2 Jquery 라이브러리 추가하기
jquery는 CDN을 이용하여, 라이브러리를 추가할 수 있습니다. 
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
```
위 코드를 `<head>` 태그 안에 추가하면, jquery를 사용할 수 있습니다. 
혹은, jquery 의 자바스크립트 파일을 직접 로컬에 저장하여, 이전 [자바스크립트](../1주차/js.md)에서 배웠던 방법으로 추가할 수 있습니다.

## 2. Jquery 사용법
### 2.1 선택자
jquery는 css 선택자를 사용하여, html 태그를 선택할 수 있습니다. 
```javascript
$("p") // p 태그를 선택합니다.
$(".class") // class가 class인 태그를 선택합니다.
$("#id") // id가 id인 태그를 선택합니다.
$("*") // 모든 태그를 선택합니다.
$("p.intro") // class가 intro인 p 태그를 선택합니다.
$("p:first") // 첫번째 p 태그를 선택합니다.
$("ul li:first") // 첫번째 ul 태그의 첫번째 li 태그를 선택합니다.
$("ul li:first-child") // 모든 ul 태그의 첫번째 li 태그를 선택합니다.
$("[href]") // href 속성을 가진 태그를 선택합니다.
$("a[target='_blank']") // target 속성이 _blank인 a 태그를 선택합니다.
...
```
### 2.2 이벤트
jquery는 다양한 이벤트를 제공합니다. 이벤트는 선택자 뒤에 붙여서 사용합니다.
```javascript
$("p").click() // 클릭 이벤트
$("p").dblclick() // 더블 클릭 이벤트
$("p").mouseenter() // 마우스가 해당 태그로 들어갔을 때 이벤트
$("p").mouseleave() // 마우스가 해당 태그에서 나갔을 때 이벤트
$("p").mousedown() // 마우스 버튼을 눌렀을 때 이벤트
$("p").mouseup() // 마우스 버튼을 눌렀다 뗐을 때 이벤트
$("p").hover() // 마우스가 해당 태그로 들어갔을 때, 나갔을 때 이벤트
$("p").focus() // 해당 태그에 포커스가 갔을 때 이벤트
$("p").blur() // 해당 태그에 포커스가 나갔을 때 이벤트
```

### 2.3 이벤트 메소드
이벤트가 발생했을 때, 실행할 함수를 정의할 수 있습니다.
```javascript   
$("p").click(function(){
  // 실행할 코드
});
```
### 2.4 HTML 메소드
jquery는 HTML 요소를 조작할 수 있는 메소드를 제공합니다.
```javascript
$("p").html() // 해당 태그의 html 코드를 가져옵니다.
$("p").text() // 해당 태그의 텍스트를 가져옵니다.
$("p").val() // 해당 태그의 value를 가져옵니다.
$("p").attr() // 해당 태그의 속성을 가져옵니다.
$("p").width() // 해당 태그의 너비를 가져옵니다.
$("p").height() // 해당 태그의 높이를 가져옵니다.
$("p").innerWidth() // 해당 태그의 너비를 가져옵니다. (padding 포함)
$("p").innerHeight() // 해당 태그의 높이를 가져옵니다. (padding 포함)
...
```

# 3. Jquery AJAX
jquery는 AJAX를 쉽게 사용할 수 있도록 도와줍니다. AJAX는 Asynchronous JavaScript and XML의 약자로, 비동기적으로 서버와 통신할 수 있도록 해줍니다. 
```javascript
<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
<script>
$(document).ready(function(){
  $("button").click(function(){
    $("#div1").load("demo_test.txt");
  });
});
</script>
</head>
<body>

<div id="div1"><h2>Let jQuery AJAX Change This Text</h2></div>

<button>Get External Content</button>

</body>
</html>
```
[실행해보기](https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_ajax_load)

AJAX를 통해서, 웹페이지의 일부를 해당 페이지를 새로고침 없이 수정할 수 있습니다. 위 코드를 보면, 버튼을 클릭하면, `demo_test.txt` 파일의 내용을 `div1` 태그에 불러옵니다. 이처럼, AJAX를 이용하면, 서버와 통신하여, 웹페이지의 일부를 수정할 수 있습니다.
Jquery는 이런 AJAX 기능을 쉬게 사용할 수 있게 해주고, 외부 서버에서 데이터를, HTTP Get/Post를 사용하여 JSON을, 해당 html 문서에 직접 삽입시킬 수 있습니다.
