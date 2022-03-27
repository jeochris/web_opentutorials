var roles = {
    'programmer' : 'egoing',
    'designer' : 'k8805',
    'manager' : 'hoya'
}
for(var name in roles){
    console.log(name, ' ', roles[name]);
}



var f = function(){
    console.log(1+1);
}
console.log(f);
f();

var a = [f];
a[0]();

var o = {
    func:f
}
o.func();



var oo = {
    v1:'v1',
    v2:'v2',
    f1:function(){
        console.log(this.v1);
    },
    f2:function(){
        console.log(this.v2);
    }
}
oo.f1();
oo.f2();