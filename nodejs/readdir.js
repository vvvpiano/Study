var testFolder = './data'; //현재워킹디렉토리(main.js가 있는 폴더겠지?)를 기준으로 경로 적어줌.
var fs = require('fs');

fs.readdir(testFolder, fuction(error, filelist) {
  console.log(filelist);
})
