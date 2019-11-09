var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;// path는 쿼리스트링 포함. pathname은 포함하지 않고 보여줌.

    if(pathname === '/') {
      if(queryData.id === undefined){

        fs.readdir('./data', function(error, filelist){
          console.log(filelist);
          var title = 'Welcome';

          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
          }
          list = list+'</ul>';

          var description = 'Hello, Node.js';
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
      `;
        response.writeHead(200);
        response.end(template);
        })



    } else {
      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';

        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1;
        }
        list = list+'</ul>';
      fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
        var title = queryData.id;
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
    `;
      response.writeHead(200); // 웹브라우저가 웹서버에 접속했을 때 웹서버가 응답을 할 것. 이 때 잘 됐는지 에러가 있는지 페이지가 옮겨졌는지 등의 내용을 통신할 수 있어야 함. 200은 성공적으로 전송했다는 코드.
      response.end(template);
      });  //response.end(fs.readFileSync(__dirname + url)); // 사용자가 접속한 url에 따라서 여기에 있는 파일을 읽어주는 코드였음.
    });
    }
    } else {
      response.writeHead(404); // 페이지 파일을 찾을 수 없을 때
      response.end('Not found')
    }

});
app.listen(3000);
