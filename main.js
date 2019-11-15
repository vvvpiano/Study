var http = require('http');
var fs = require('fs'); // fs모듈을 불러와서 fs이름을 붙임 import와 비슷한 개념인가? => 맞음!
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js')
var path = require('path'); //  경로 세탁을 위함
var sanitizeHtml = require('sanitize-html');

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

function templatelist(filelist){
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
          var list = template.list(filelist);
          var html = template.HTML(title, list, `
            <h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      } else {
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base; // 외부에서 들어오는 파일을 읽는 부분을 점검할 필요가 있음. queryData.id => 경로정보, 경로정보를 세탁하는 코드.
      fs.readFile(`data/${filteredId}`, 'utf-8', function(err, description){
        var list = template.list(filelist);
        var title = queryData.id;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(discription);
        var html = template.HTML(title, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/create">create</a>
        <a href="/update?id=${sanitizedTitle}">update</a>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`);
        response.writeHead(200); // 웹브라우저가 웹서버에 접속했을 때 웹서버가 응답을 할 것. 이 때 잘 됐는지 에러가 있는지 페이지가 옮겨졌는지 등의 내용을 통신할 수 있어야 함. 200은 성공적으로 전송했다는 코드.
        response.end(html);
        });  //response.end(fs.readFileSync(__dirname + url)); // 사용자가 접속한 url에 따라서 여기에 있는 파일을 읽어주는 코드였음.
      });
    }
  } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
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
      response.end(html);
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
    });
  } else if(pathname === '/update') {
    fs.readdir('./data', function(error, filelist){
      var list = template.list(filelist);
      var filteredId = path.parse(queryData.id).base;
    fs.readFile(`data/${filteredId}`, 'utf-8', function(err, description){
      var title = queryData.id;
      var html = template.HTML(title, list,
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
      response.end(html);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`./data/${id}`, `data/${title}`, function(error){ // 넘겨받은 id는 수정되기 전의 파일 이름, title은 새로 입력받아 수정되었을 수도 있는 파일 이름임을 주의!, 이 라인에서 파일 이름을 title로 바꿨으니 아래 콜백함수에서 data/title으로 파일을 찾는 것이 자연스러움.
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
    });
  } else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });
  }
    else {
    response.writeHead(404); // 페이지 파일을 찾을 수 없을 때
    response.end('Not found');
  }
});
app.listen(3000);
