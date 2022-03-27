var fs = require('fs');

console.log('sync')
console.log('A');
var result = fs.readFileSync('node_practice/sample.txt', 'utf8');
console.log(result);
console.log('C');

console.log('\nasync')
console.log('A');
fs.readFile('node_practice/sample.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');