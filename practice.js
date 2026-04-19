/** 1. Scope and Shadowing
 * Scope is the current context of execution in which values and expressions are "visible" or can be referenced. 
 * If a variable or other expression is not in the current scope, it cannot be used. Scopes can also be nested, 
 * meaning that a scope can contain another scope. The inner scope can access variables and other resources of 
 * its parent scope, but the outer scope cannot access those of the inner scope.
 * 
 * var x= 10
a()
b() 
console.log(x)

function a(){
    var x = 20
    console.log(x)
}   

function b(){
    let x = 33
    console.log(x)
}
// Results in 20, 33, 10

 */

// -------------------------------------------------------------------------------------------------------------------------------

/* 2. Variable Redeclaration and Reassignment
var a = 10
var a =20
console.log(a)
// Results in 20. The variable a is redeclared and reassigned, so the final value of a is 20.
*/

// -------------------------------------------------------------------------------------------------------------------------------

/* 3 Variable Shadowing and Redeclaration with let
let b = 10
let b = 20
console.log(b)
// Results in a SyntaxError. The variable b is declared twice using let, which is not allowed. Each variable can only be declared once in the same scope when using let.
*/

// -------------------------------------------------------------------------------------------------------------------------------

/* 3.1 Variable Shadowing and Redeclaration with const
const c = 10
const c = 20
console.log(c)
// Results in a SyntaxError. The variable c is declared twice using const, which is not allowed. Each variable can only be declared once in the same scope when using const.
*/

// -------------------------------------------------------------------------------------------------------------------------------


/** 3.2. Shadowing and Variable Scope
 * Shadowing occurs when a variable declared within a certain scope (e.g., a function) has the same name as a variable declared in an outer scope.
 
const c=100
function a(){
    const c = 10
    console.log(c)
}

a()
console.log(c)

// Results in 10, 100. The variable c defined inside the function a() shadows the variable c defined in the outer scope.
*/

// -------------------------------------------------------------------------------------------------------------------------------


/* 4. Variable Shadowing with let
let c = 10
function outer(){
    let c = 20
    console.log(c)
}   

outer()
console.log(c)
// Results in 20, 10. The variable c inside the function outer() shadows the variable c in the outer scope, so when console.log(c) is called inside the function, it refers to the inner variable c (20). When console.log(c) is called outside the function, it refers to the outer variable c (10).
*/

// -------------------------------------------------------------------------------------------------------------------------------

/** 5. Global Scope and the Window Object
 * In a browser environment, variables declared with var in the global scope become properties of the window object. 
 * However, variables declared with let or const do not become properties of the window object.
 
 * var a=10
 * console.log(window.a)
 * console.log(a)
 * console.log(this.a)
 * 
 * // Results in 10,10, 10
 */

// -------------------------------------------------------------------------------------------------------------------------------

/** 6. Lexical Scoping and Closure
 * 
function a(){
    var x = 10
    b()
    function b(){
        console.log(x)
    }
}

a()
// Results in 10, because of lexical scoping. The function b() can access the variable x defined in its parent function a().
*/

// -------------------------------------------------------------------------------------------------------------------------------

/** 7. Closure and Maintaining State
 * 
function attachEventListener(){
    var count = 0;  
    document.getElementById("btn").addEventListener("click", function(){
        count++;
        console.log(count);
    }) 
}

attachEventListener()
// Results in 1, 2, 3, ... each time the button is clicked. The variable count is accessible to the event listener function due to closure, allowing it to maintain state across multiple clicks.

*/

// -------------------------------------------------------------------------------------------------------------------------------

/** 8. Closure and Looping with setTimeout 
 * Logs the numbers 0 to 4 to the console, with a delay of 1000ms, 2000ms, 3000ms, 4000ms, and 5000ms respectively.
 
function x() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            console.log(i)
        }, i * 1000)
    }
}

// x() 
// Results in 5, 5, 5, 5, 5. This is because the variable i is declared with var, which has function scope. By the time the setTimeout callbacks are executed, the loop has completed and i has the value of 5.

function y() {
    for (let i = 0; i < 5; i++) {
        setTimeout(function () {
            console.log(i)
        }, i * 1000)
    }
}

y()
// Results in 0, 1, 2, 3, 4. This is because the variable i is declared with let, which has block scope. Each iteration of the loop creates a new scope for i, allowing the setTimeout callbacks to capture the correct value of i at each iteration.


function z() {
    for (var i = 0; i < 5; i++) {
        function close (j) {
            setTimeout(function () {
                console.log(j)
            }, j * 1000)
        }
        close (i)   
    }
}

z()
// Results in 0, 1, 2, 3, 4. This is because the IIFE (Immediately Invoked Function Expression) creates a new scope for each iteration of the loop, allowing the setTimeout callbacks to capture the correct value of i (passed as j) at each iteration.

*/

// -------------------------------------------------------------------------------------------------------------------------------

/** 9. Closure and Maintaining State in Nested Functions
 * Closure is a feature in JavaScript where an inner function has access to the outer (enclosing) function's variables and parameters, even after the outer function has returned. This allows the inner function to maintain access to the scope of the outer function, enabling it to use and manipulate those variables.
 * here inner function can access the variable count defined in the outer function, even after the outer function has finished executing. This is because of closure, which allows the inner function to "remember" the environment in which it was created.

function outest() {
    var c = 10;
    function outer(b) {
        var count = 0;  
        function inner() {
            console.log(count, b, c); 
        }
        return inner;
    }
}

var closureFunction = outest()(5);
closureFunction(); // Logs: 0 5 10
*/

// -------------------------------------------------------------------------------------------------------------------------------

/** 10. Memoization / Caching with Closures
Cache expensive results — compute once, reuse forever.

function memoize(fn) {
  const cache = {};

  return function(n) {
    if (n in cache) {
      console.log("from cache");
      return cache[n];
    }
    cache[n] = fn(n);
    return cache[n];
  };
}
  

const factorial = memoize(n => n <= 1 ? 1 : n * factorial(n - 1));

factorial(5); // calculates → 120
factorial(5); // from cache → 120
*/