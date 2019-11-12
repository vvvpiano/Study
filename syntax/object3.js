var o = {
  v1:'v1',
  v2:'v2',
  f1:function(){
    console.log(this.v1);
  },
  f2:function(){
    console.log(this.v2);
  }
}

p.f1();
p.f2();

// 우리가 만든 변수와 함수들을 하나의 객체 안에 묶어서 잘 구분해 놓을 수 있다. 많은 사람이 협업하여 개발할 때 유용. this를 통해 코드의 변수와 함수들을 호출함으로써 어떤 객체에 이 object를 담아도 함수와 변수를 안정적으로 호출할 수 있다는 장점이 있다.
