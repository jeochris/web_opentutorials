// refactoring
module.exports = {
    html:
    // template for html to output
    // list - file list
    // body - paragraph
    // control - create, update, delete
    function(title, list, body, control){
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
    },

    list:
    // template for file list
    function(filelist){
        var list = '<ol>';
        var i = 0;
        while(i<filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i+1;
        }
        list = list + '</ol>';
        return list;
    }
}