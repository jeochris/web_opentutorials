var fs = require('fs');

fs.readFile('node_practice/sample.txt', 'utf8', function(err, data){
    console.log(data);
});