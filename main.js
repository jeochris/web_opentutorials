var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// template for html to output
// list - file list
// body - paragraph
// control - create, update, delete
function templateHTML(title, list, body, control){
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8" />
    </head>
    
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
    </body>
    </html>`;
}

// template for file list
function templateList(filelist){
    var list = '<ol>';
    var i = 0;
    while(i<filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i+1;
    }
    list = list + '</ol>';
    return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    //console.log(url);
    //console.log(queryData.id)
    //console.log(url.parse(_url, true).pathname);

    // depends on pathname
    if(pathname === '/'){
        if(queryData.id === undefined){
            // when home page
            // read files to output file list
            fs.readdir('./data', function(error, filelist){
                //console.log(filelist);
                var title = 'Welcome';
                var description = 'Hello, Node.js';

                var list = templateList(filelist);
                var template = templateHTML(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);

                response.writeHead(200);
                response.end(template);
            });
            
        } else{
            // when each file page
            fs.readdir('./data', function(error, filelist){
                // read each file's description
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`);
                        // update - moving to current page's update page by query string
                        // delete - to post current page's info as well, add hidden input
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if(pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
            //console.log(filelist);
            var title = 'create';
            var list = templateList(filelist);
            var template = templateHTML(title, list,
                `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>`,'');
                // move to create_process with user's input
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname === '/create_process'){
        var body = '';
        // gather all post data
        request.on('data', function(data){
            body += data;
        });
        // parse - title, description
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            // make new file
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                // redirect to new file page
                response.writeHead(302, {Location : `/?id=${title}`});
                response.end();
            });
            //console.log(post.title);
        });
    } else if(pathname === '/update'){
        fs.readdir('./data', function(error, filelist){
            // should show current file's data
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list,
                    `<form action="/update_process" method="post">
                    <p><input type="hidden" name="id" value="${title}"></p>
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit"></p>
                    </form>`,
                    ``);
                    // move to update_process with user's input
                    // to preserve current page's title, let new hidden input with its name 'id'
                    // we have to access current page with 'id'
                response.writeHead(200);
                response.end(template);
            });
        });
    } else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id; // id as well
            var title = post.title;
            var description = post.description;
            
            // consider if file title changes
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location : `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            // delete file named 'id'
            fs.unlink(`data/${id}`, function(err){
                // redirect to home
                response.writeHead(302, {Location : `/`});
                response.end();
            });
        });
    } else{
        response.writeHead(404);
        response.end('Not found');
    }
    // console.log(__dirname + url);
    // response.end('egoing : '+url);
    // response.end(queryData.id);
});
app.listen(3000);