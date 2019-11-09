var fs = require('fs');
/*
// readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');
*/

// readFile
console.log('A');
var result = fs.readFile('syntax/sample.txt', 'utf-8', function(err, result){ // 파일을 읽는 작업이 끝나면 이 함수를 nodejs가 실행시키면서 에러가 있다면 첫번째 파라미터에 에러를 제공하고, 두번째 파라미터에는 파일의 내용을 인자로써 공급해주도록 약속 되어있음.
  console.log(result);
}); // readFile은 callback인자를 필요로 함. => function
console.log(result);
console.log('C');

/*
결과는
A
C
B
*/
