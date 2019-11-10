var http = require('http');
var fs = require('fs'); // fs모듈을 불러와서 fs이름을 붙임 import와 비슷한 개념인가?
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return  `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
`;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
  /*
  createServer는 nodejs로 웹브라우저가 접속이 들어올 때 마다 createServer의 callback함수를 nodejs가 호출함. 그 때 이 callbock함수에 인자 두개를 주는데 request에는 요청할 때 웹브라우저가 보낸 정보들, response는 응답할 때 서버가 웹브라우저한테 전달할 정보를 줌.
  */
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;// path는 쿼리스트링 포함. pathname은 포함하지 않고 보여줌.
    if(pathname === '/') {
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
            <h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
        });
      } else {
      fs.readdir('./data', function(error, filelist){
        var list = templateList(filelist);
      fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
        var title = queryData.id;
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200); // 웹브라우저가 웹서버에 접속했을 때 웹서버가 응답을 할 것. 이 때 잘 됐는지 에러가 있는지 페이지가 옮겨졌는지 등의 내용을 통신할 수 있어야 함. 200은 성공적으로 전송했다는 코드.
        response.end(template);
        });  //response.end(fs.readFileSync(__dirname + url)); // 사용자가 접속한 url에 따라서 여기에 있는 파일을 읽어주는 코드였음.
      });
    }
  } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,'');
      response.writeHead(200); // 200은 성공했다는 뜻
      response.end(template);
      });
  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){
      /*웹브라우저가 post방식으로 데이터를 전송할 때 정보가 많으면 한번에 처리하다가 여러 문제가 생기기도 함. nodejs에서는 이런 경우를 대비해서 이런 방법을 제공. 조각조각의 양을 서버쪽에서 수신할 때마다 이 콜백함수를 호출하도록 되어있음. 콜백이 실행될 때 마다 조각씩 받아온 데이터를 body에 이어붙임.
      */
      body = body + data;
    });
    request.on('end', function(){
      /* 위에서처럼 정보를 받아오다가 더이상 받아올 정보가 없으면 이 함수를 호출하도록 되어있음. 'end'에 해당되는 콜백이 실행됐을때 정보수신이 끝났다고 판다.
      */
      var post = qs.parse(body); // 받아온 body를 입력값으로
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`}); // 302는 redirection하라는 뜻
        response.end();
      })
    })
  } else if(pathname === '/update') {
    fs.readdir('./data', function(error, filelist){
      var list = templateList(filelist);
    fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
      var title = queryData.id;
      var template = templateHTML(title, list,
        `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}"> <!--숨겨서 안보임, 하지만 submit버튼을 눌렀을 때 id라는 이름으로 value가 전송이 될 것.(title이 수정된다면)-->
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
      response.writeHead(200);
      response.end(template);
      });
    });
  }
    else {
    response.writeHead(404); // 페이지 파일을 찾을 수 없을 때
    response.end('Not found');
  }
});
app.listen(3000);
