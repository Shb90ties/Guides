*** ES6, ECMA script 6 ***
*** compile to ES5 or minify js using babeljs.io ***
    
// templaye string
var myText = "dfsdfsd";
var myHtml = `<div>
                <span>${myText + ' outside var'}</span>
              </div>`;




// destructure
var source = { x: 5, y: 6 };
var { x, y } = source;
    // equals to => var x = source.x; var y = source.y
var sourceArr = ['bob','tom'];
var [ nameA, nameB ] = sourceArr;
    // equals to => var nameA = source[0]; var nameB = source[1]

var z = 10;
var myRect = {
    a: 10,
    b: 30,
    z, // will look for z variable and assign value
    myFunc() {
        console.log("myRect.myFunc(); doesn't need the : ")
    },
    ["count_" + z]: 'dsfds', // translate to { 'count_10': 'dsdfds' }
    "key with spaces": 6666, // needs to be called like this myRect["key with spaces"];
}
// help padding specific args to functions
                // default
myFunc({x, y, max = 50, callback}) {
    console.log(x);
    console.log(y);
    console.log(max);
    (callback) ? callback() : return;
}
myFunc({50, 10, max: 100});
myFunc({50, 10, callback: () => {} });
    // old way myFunc(50,10,null,()=>{}); saves the trouble of passing uneeded args




// variables: var,let,const
for() {
    let a = 50; // new for the current loop, gets destroyed after the loop
    const b = 2
    b = 2 // error! cannot change native type const
    const b1 = { b: 3 };
    b1.b = 5 // ok, but not recommanded
}
// undefined outside for
for() {
    var b = 2
}
// defined outside for




// Class!!!
    /** Old JS class way
        function Desk() {}
        Desk.prototype.name = 'dsfasdf'; ..... **/
Class Desk {
    size = 50;
    
    constructor() {
        
    }
    print() {
        
    }
    static a() {
        
    }
}
module.exports = Desk;
//
const Desk = require("path^");
var desk = new Desk();
desk.print();
Desk.a();

Class Mahagoni extends Desk {
    constructor() {
        super();
    }
    ...
}
    

    
    
// Functions
    // this in old : function() {...}.bind(this)
        // not needed in () => {...}
// old : var myF = function() {....}
var myF = () => {....}
var myOneLineFun(a,b) => return a+b;
    myOneLineFun(a => a+1)
[1,2,3].map(val => val++); // [2,3,4]

// async funciton
async function () {
    var data = $.get('http://...');
    console.log(data);
} 



// Rest & Spreads parameters ...
    // Rest = contain arguments to an array OR Spreads = splits array to arguments
function printArr(...myArr) { // Rest
    for (var a of myArr) {
        console.log(a);
    }
}
printArr(55, 44, 3322); // reads it like an array

// Reverse
function printArr(nameA, nameB) {
    console.log(nameA);
    console.log(nameB);
}
printArr(...['aaa', 'bbb']); // Speard
    
    

// Modules
    module.export.a = function() {...}
    module.export.b = function() {...}
    export default {...}
    export var a = 3;
    export function a() {...}
    
    // in user file
    import myMod from "path"; // instead of // var myMod = require("path");
    import {a,b} from "path";



// Generators (in ES6 harmony use traceur not babel for it)
    // stop continue functions*, helpful with promises
var generator = function*() { // function* is for generators
    var num = yield 1; // stop the function on yield and wait for the next() command to continue
    var data = yield $.get('/www....'); // stop the function 
}
var gen = generator();
gen().next(5); // stops at num gives it a 5 and keeps on going to the next yield
if (gen().then) { // checks if the yield is a promise, if it is do the next after it returns
    gen().then(gen().next);
}