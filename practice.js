// ─── 1. Scope and Shadowing ──────────────────────────────────────────────────
// KEY: Inner scope sees outer variables; outer scope cannot see inner variables.

/*
var x = 10
a()
b()
console.log(x)

function a() {
  var x = 20
  console.log(x)
}

function b() {
  let x = 33
  console.log(x)
}
// Results in 20, 33, 10
*/


// ─── 2. Variable Redeclaration and Reassignment (var) ────────────────────────
// KEY: var allows redeclaration in the same scope; the last assignment wins.

/*
var a = 10
var a = 20
console.log(a)
// Results in 20
*/


// ─── 3. Variable Redeclaration with let ──────────────────────────────────────
// KEY: let does not allow redeclaration in the same scope — throws SyntaxError.

/*
let b = 10
let b = 20
console.log(b)
// Results in SyntaxError: Identifier 'b' has already been declared
*/


// ─── 3.1. Variable Redeclaration with const ──────────────────────────────────
// KEY: const also prohibits redeclaration and additionally prohibits reassignment.

/*
const c = 10
const c = 20
console.log(c)
// Results in SyntaxError: Identifier 'c' has already been declared
*/


// ─── 3.2. Shadowing and Variable Scope ───────────────────────────────────────
// KEY: A same-named variable in an inner scope shadows the outer one without affecting it.

/*
const c = 100
function a() {
  const c = 10
  console.log(c)
}

a()
console.log(c)
// Results in 10, 100
*/


// ─── 4. Variable Shadowing with let ──────────────────────────────────────────
// KEY: let inside a function creates a new binding; the outer binding is untouched.

/*
let c = 10
function outer() {
  let c = 20
  console.log(c)
}

outer()
console.log(c)
// Results in 20, 10
*/


// ─── 5. Global Scope and the Window Object ───────────────────────────────────
// KEY: var globals attach to window; let/const globals do not.

/*
var a = 10
console.log(window.a)   // 10
console.log(a)          // 10
console.log(this.a)     // 10
// Results in 10, 10, 10
*/


// ─── 6. Lexical Scoping ──────────────────────────────────────────────────────
// KEY: A function's scope is determined by where it is written, not where it is called.

/*
function a() {
  var x = 10
  b()
  function b() {
    console.log(x)
  }
}

a()
// Results in 10
*/


// ─── 7. Closure — Maintaining State ──────────────────────────────────────────
// KEY: An inner function retains access to its outer function's variables even after the outer function returns.

/*
function attachEventListener() {
  var count = 0
  document.getElementById("btn").addEventListener("click", function () {
    count++
    console.log(count)
  })
}

attachEventListener()
// Results in 1, 2, 3, … on each button click
*/


// ─── 8. Closure — Looping with setTimeout ────────────────────────────────────
// KEY: var shares one binding across all iterations; let creates a fresh binding per iteration.

/*
function x() {
  for (var i = 0; i < 5; i++) {
    setTimeout(function () { console.log(i) }, i * 1000)
  }
}
x()
// Results in 5, 5, 5, 5, 5  ← var: single shared i, already 5 when callbacks fire

function y() {
  for (let i = 0; i < 5; i++) {
    setTimeout(function () { console.log(i) }, i * 1000)
  }
}
y()
// Results in 0, 1, 2, 3, 4  ← let: new i per iteration, each callback captures its own copy

function z() {
  for (var i = 0; i < 5; i++) {
    function close(j) {
      setTimeout(function () { console.log(j) }, j * 1000)
    }
    close(i)
  }
}
z()
// Results in 0, 1, 2, 3, 4  ← passing i as an argument freezes its value in a new scope
*/


// ─── 9. Closure — Nested Functions ───────────────────────────────────────────
// KEY: Closures capture variables from every enclosing scope, not just the immediate parent.

/*
function outest() {
  var c = 10
  function outer(b) {
    var count = 0
    function inner() {
      console.log(count, b, c)
    }
    return inner
  }
  return outer
}

var closureFunction = outest()(5)
closureFunction()
// Results in 0 5 10
*/


// ─── 10. Memoization / Caching with Closures ─────────────────────────────────
// KEY: Cache expensive results — compute once, reuse forever via a closure over a shared cache object.

/*
function memoize(fn) {
  const cache = {}
  return function (n) {
    if (n in cache) {
      console.log("from cache")
      return cache[n]
    }
    cache[n] = fn(n)
    return cache[n]
  }
}

const factorial = memoize(n => n <= 1 ? 1 : n * factorial(n - 1))

factorial(5)  // calculates → 120
factorial(5)  // from cache → 120
*/
