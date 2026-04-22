// ============================================================
//  THIS IN JAVASCRIPT — All Behaviors Explained
// ============================================================


// ─────────────────────────────────────────────
// 1. GLOBAL CONTEXT
//    In a browser, `this` at the top level = window
//    In Node.js, `this` at the top level = {} (module wrapper)
// ─────────────────────────────────────────────

console.log("=== 1. GLOBAL CONTEXT ===");
// In browser:  this === window
// In Node.js:  this === module.exports (empty object {})
console.log(this); // {} in Node.js


// ─────────────────────────────────────────────
// 2. REGULAR FUNCTION
//    When called standalone (not as a method),
//    `this` is the global object (window) in sloppy mode
//    or `undefined` in strict mode.
// ─────────────────────────────────────────────

console.log("\n=== 2. REGULAR FUNCTION ===");

function showThis() {
  console.log(this); // global object or undefined (strict mode)
}
showThis(); // window / global / undefined

function showStrict() {
  "use strict";
  console.log(this); // undefined
}
showStrict(); // undefined


// ─────────────────────────────────────────────
// 3. METHOD CALL
//    When a function is called as a property of an object,
//    `this` = that object (the thing before the dot).
// ─────────────────────────────────────────────

console.log("\n=== 3. METHOD CALL ===");

const user = {
  name: "Umer",
  greet() {
    console.log(this.name); // "Umer" — this = user object
  },
};
user.greet(); // "Umer"


// ─────────────────────────────────────────────
// 4. DETACHED METHOD (Lost `this`)
//    Assigning a method to a variable detaches it from
//    its object. `this` is lost — it falls back to global.
// ─────────────────────────────────────────────

console.log("\n=== 4. DETACHED METHOD ===");

const detached = user.greet;
// detached() — calling standalone loses the user context
// this = global / undefined (strict). user.name won't be found.
try {
  detached(); // undefined or error in strict mode
} catch (e) {
  console.log("Error: this is undefined in strict mode");
}


// ─────────────────────────────────────────────
// 5. ARROW FUNCTION
//    Arrow functions do NOT have their own `this`.
//    They inherit `this` from the enclosing lexical scope
//    (whatever `this` was at the time the arrow was defined).
// ─────────────────────────────────────────────

console.log("\n=== 5. ARROW FUNCTION ===");

const obj = {
  name: "Umer",

  // ❌ Arrow as method — `this` comes from module scope, NOT obj
  arrowMethod: () => {
    console.log("Arrow method this.name:", this?.name); // undefined
  },

  // ✅ Regular method with arrow inside — arrow inherits `this` from regularMethod
  regularMethod() {
    const inner = () => {
      console.log("Arrow inside method this.name:", this.name); // "Umer"
    };
    inner();
  },

  // ✅ Classic use case: preserving `this` inside setTimeout
  delayedGreet() {
    setTimeout(() => {
      console.log("After timeout this.name:", this.name); // "Umer"
    }, 0);
  },
};

obj.arrowMethod();   // undefined
obj.regularMethod(); // "Umer"
obj.delayedGreet();  // "Umer" (after 0ms)


// ─────────────────────────────────────────────
// 6. CONSTRUCTOR / new
//    When a function is called with `new`, JS:
//    1. Creates a new empty object {}
//    2. Sets `this` to that new object
//    3. Executes the function body
//    4. Returns `this` (the new object) automatically
// ─────────────────────────────────────────────

console.log("\n=== 6. CONSTRUCTOR / new ===");

function Person(name, age) {
  this.name = name; // this = new empty object
  this.age = age;
  // implicitly returns `this`
}

const p1 = new Person("Umer", 25);
console.log(p1.name); // "Umer"
console.log(p1.age);  // 25


// ─────────────────────────────────────────────
// 7. CLASS
//    Same as constructor functions — `this` is the instance.
//    But methods detached from the class still lose `this`.
// ─────────────────────────────────────────────

console.log("\n=== 7. CLASS ===");

class Animal {
  constructor(type) {
    this.type = type;
  }

  speak() {
    console.log(`${this.type} speaks`); // this = instance
  }
}

const dog = new Animal("Dog");
dog.speak(); // "Dog speaks"

const fn = dog.speak;
try {
  fn(); // TypeError — this is undefined, this.type fails
} catch (e) {
  console.log("Detached class method error:", e.message);
}


// ─────────────────────────────────────────────
// 8. EVENT LISTENER
//    In a DOM event listener using a regular function,
//    `this` = the DOM element that fired the event.
//    Arrow functions do NOT get the element — they keep outer `this`.
// ─────────────────────────────────────────────

console.log("\n=== 8. EVENT LISTENER (browser only) ===");

/*
  // Regular function — this = button element
  button.addEventListener("click", function () {
    console.log(this); // <button>
  });

  // Arrow function — this = outer scope (window/module), NOT button
  button.addEventListener("click", () => {
    console.log(this); // window or undefined
  });
*/

console.log("(Skip in Node.js — DOM not available)");


// ============================================================
//  CALL, APPLY, BIND — Explicit `this` Control
// ============================================================
//
//  All three let you manually set what `this` is.
//  The difference is HOW and WHEN the function is invoked.
//
// ============================================================

function introduce(greeting, punctuation) {
  console.log(`${greeting}, I am ${this.name}${punctuation}`);
}

const alice = { name: "Alice" };
const bob   = { name: "Bob" };


// ─────────────────────────────────────────────
// 9. CALL
//    fn.call(thisArg, arg1, arg2, ...)
//
//    - Calls the function IMMEDIATELY
//    - Sets `this` to thisArg
//    - Passes arguments one by one (comma-separated)
// ─────────────────────────────────────────────

console.log("\n=== 9. CALL ===");

introduce.call(alice, "Hello", "!");  // Hello, I am Alice!
introduce.call(bob,   "Hi",   ".");   // Hi, I am Bob.

// Real-world use case: borrowing methods from another object
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const arr = Array.prototype.slice.call(arrayLike); // borrow Array's slice
console.log(arr); // ["a", "b", "c"]


// ─────────────────────────────────────────────
// 10. APPLY
//     fn.apply(thisArg, [arg1, arg2, ...])
//
//     - Calls the function IMMEDIATELY (same as call)
//     - Sets `this` to thisArg
//     - Passes arguments as an ARRAY (key difference from call)
//
//     Memory tip: A = Apply = Array
// ─────────────────────────────────────────────

console.log("\n=== 10. APPLY ===");

introduce.apply(alice, ["Hello", "!"]);  // Hello, I am Alice!
introduce.apply(bob,   ["Hi",   "."]);   // Hi, I am Bob.

// Real-world use case: spreading an array into a function that takes individual args
const numbers = [5, 2, 9, 1, 7];
const max = Math.max.apply(null, numbers); // same as Math.max(5, 2, 9, 1, 7)
console.log(max); // 9
// (Modern alternative: Math.max(...numbers) — spread operator replaces apply in most cases)


// ─────────────────────────────────────────────
// 11. BIND
//     fn.bind(thisArg, arg1, arg2, ...)
//
//     - Does NOT call the function immediately
//     - Returns a NEW function with `this` permanently locked
//     - Optional: pre-fill (curry) arguments
//     - The bound `this` cannot be overridden later, even with call/apply
// ─────────────────────────────────────────────

console.log("\n=== 11. BIND ===");

const introduceAsAlice = introduce.bind(alice);
introduceAsAlice("Hey", "~"); // Hey, I am Alice~

// Can still pass args at call time
const introduceAsBob = introduce.bind(bob);
introduceAsBob("Yo", "?"); // Yo, I am Bob?

// bind + partial application (pre-filling arguments)
const aliceFormal = introduce.bind(alice, "Good morning"); // greeting pre-filled
aliceFormal(".");  // Good morning, I am Alice.
aliceFormal("!"); // Good morning, I am Alice!

// Real-world: fixing `this` loss in class methods for callbacks
class Timer {
  constructor() {
    this.seconds = 0;
    this.tick = this.tick.bind(this); // lock `this` to instance
  }

  tick() {
    this.seconds++;
    console.log("Seconds:", this.seconds);
  }

  start() {
    setInterval(this.tick, 1000); // `this` is safe — bound in constructor
  }
}

// bind vs arrow class field (modern alternative)
class TimerModern {
  seconds = 0;
  tick = () => {  // arrow field — `this` locked via closure, no bind needed
    this.seconds++;
    console.log("Seconds (modern):", this.seconds);
  };
}


// ─────────────────────────────────────────────
// CALL vs APPLY vs BIND — Side by Side
// ─────────────────────────────────────────────

console.log("\n=== CALL vs APPLY vs BIND ===");

/*
  METHOD    INVOKES?   ARGS FORMAT         RETURNS
  ─────────────────────────────────────────────────────
  call      Yes        comma-separated     result of fn
  apply     Yes        array               result of fn
  bind      No         comma-separated     new function

  call  → fn.call(ctx, a, b)       runs now
  apply → fn.apply(ctx, [a, b])    runs now, args in array
  bind  → fn.bind(ctx, a)(b)       runs later, locked this
*/

function sum(a, b, c) {
  console.log(`${this.label}: ${a + b + c}`);
}
const ctx = { label: "Total" };

sum.call(ctx, 1, 2, 3);         // Total: 6   — immediate, individual args
sum.apply(ctx, [1, 2, 3]);      // Total: 6   — immediate, array args
const boundSum = sum.bind(ctx);
boundSum(1, 2, 3);              // Total: 6   — deferred, new function


// ============================================================
//  QUICK REFERENCE — `this` Decision Table
// ============================================================
//
//  How was the function called?          What is `this`?
//  ─────────────────────────────────────────────────────────
//  fn()                                  global / undefined (strict)
//  obj.fn()                              obj
//  new fn()                              new instance
//  fn.call(x, ...)                       x
//  fn.apply(x, [...])                    x
//  fn.bind(x)(...)                       x (permanently)
//  Arrow function                        inherited from outer scope
//  DOM addEventListener (regular fn)    the DOM element
//
//  One rule: Arrow functions NEVER have their own `this`.
//            Everything else depends on the CALL SITE.
//
// ============================================================

// when to use this in comparision with var, let, const?