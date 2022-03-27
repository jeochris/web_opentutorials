// function a(){
//     console.log('A');
// }

var a = function(){
    console.log('A');
}


function slowfunc(callback){
    console.log('B');
    callback();
}

slowfunc(a);