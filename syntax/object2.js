// array, object

var f = function(){
  console.log(1+1);
  console.log(1+2);
}

console.log(f);
f();

var a = [f];
a[0](); // 배열의 원소로서 함수가 존재할 수 있다.

var o = {
  func:f
}
o.func(); // 객체의 값으로서 함수가 존재할 수 있다.

// var i = if(true){console.log(1)}; => 자바스크립트에서 if문은 값이 아님. 에러 생김

// var w = while(true){console.log(1)} = 자바스크립트에서 while문은 값이 아님. 에러 생김
