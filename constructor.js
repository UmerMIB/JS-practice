// ============================================================
//  CONSTRUCTOR IN JAVASCRIPT — In Detail
// ============================================================


// ─────────────────────────────────────────────
// 1. WHAT IS A CONSTRUCTOR FUNCTION
//    A regular function used as a blueprint to
//    create multiple objects with the same shape.
//    Convention: PascalCase name.
// ─────────────────────────────────────────────

console.log("=== 1. BASIC CONSTRUCTOR FUNCTION ===");

function User(name, age, role) {
  // `this` = the new empty object created by `new`
  this.name = name;
  this.age  = age;
  this.role = role;
}

const u1 = new User("Umer", 25, "admin");
const u2 = new User("Ali",  30, "editor");

console.log(u1); // User { name: 'Umer', age: 25, role: 'admin' }
console.log(u2); // User { name: 'Ali',  age: 30, role: 'editor' }


// ─────────────────────────────────────────────
// 2. WHAT `new` DOES STEP BY STEP
//    Behind the scenes when you call new User(...)
// ─────────────────────────────────────────────

console.log("\n=== 2. WHAT new DOES ===");

/*
  const u = new User("Umer", 25, "admin");

  Step 1: Create a new empty object
          obj = {}

  Step 2: Link it to User.prototype
          obj.__proto__ = User.prototype

  Step 3: Set `this` to that object and run the function body
          this = obj
          this.name = "Umer" → obj.name = "Umer"
          this.age  = 25     → obj.age  = 25

  Step 4: Return `this` automatically (if no explicit return)
          return obj
*/

// Simulating `new` manually to understand it
function simulateNew(Constructor, ...args) {
  const obj = {};                          // Step 1: empty object
  obj.__proto__ = Constructor.prototype;   // Step 2: link prototype
  Constructor.apply(obj, args);            // Step 3: run constructor with this = obj
  return obj;                              // Step 4: return the object
}

const u3 = simulateNew(User, "Sara", 22, "viewer");
console.log(u3.name); // "Sara" — same as using new


// ─────────────────────────────────────────────
// 3. ADDING METHODS — PROTOTYPE VS INSIDE CONSTRUCTOR
//    Methods defined inside constructor are duplicated
//    per instance (bad). Prototype methods are shared (good).
// ─────────────────────────────────────────────

console.log("\n=== 3. PROTOTYPE METHODS ===");

function Product(name, price) {
  this.name  = name;
  this.price = price;

  // ❌ Avoid: new function object created for EVERY instance
  // this.describe = function() { return this.name; }
}

// ✅ Defined once on prototype — shared across all instances
Product.prototype.describe = function () {
  return `${this.name} costs $${this.price}`;
};

Product.prototype.applyDiscount = function (percent) {
  const discounted = this.price - (this.price * percent) / 100;
  return `${this.name} after ${percent}% off: $${discounted.toFixed(2)}`;
};

const p1 = new Product("Laptop", 1200);
const p2 = new Product("Phone",  800);

console.log(p1.describe());           // "Laptop costs $1200"
console.log(p2.applyDiscount(10));    // "Phone after 10% off: $720.00"

// Both instances share the SAME prototype method (not copies)
console.log(p1.describe === p2.describe); // true — same reference


// ─────────────────────────────────────────────
// 4. PROTOTYPE CHAIN
//    How JS looks up properties and methods
// ─────────────────────────────────────────────

console.log("\n=== 4. PROTOTYPE CHAIN ===");

/*
  p1 (instance)
   ├── name: "Laptop"          ← own property
   ├── price: 1200             ← own property
   └── __proto__               → Product.prototype
                                    ├── describe()
                                    ├── applyDiscount()
                                    └── __proto__ → Object.prototype
                                                     ├── toString()
                                                     ├── hasOwnProperty()
                                                     └── __proto__ → null

  Lookup order for p1.describe():
  1. Check p1 itself        → not found
  2. Check Product.prototype → found ✅ — call it
*/

console.log(p1.hasOwnProperty("name"));     // true  — own property
console.log(p1.hasOwnProperty("describe")); // false — on prototype, not own


// ─────────────────────────────────────────────
// 5. FORGETTING `new` — A CLASSIC BUG
//    Without `new`, `this` inside constructor
//    refers to global (window/global) instead of
//    a new object. Properties leak to global scope.
// ─────────────────────────────────────────────

console.log("\n=== 5. FORGETTING new ===");

function Car(brand) {
  this.brand = brand;
}

const c1 = new Car("Toyota");
console.log(c1.brand); // "Toyota" ✅

// const c2 = Car("Honda"); // ❌ No new
// console.log(c2);          // undefined — nothing returned
// console.log(global.brand);// "Honda" — leaked to global! 💀

// ✅ Guard: make constructor safe with or without `new`
function SafeCar(brand) {
  if (!(this instanceof SafeCar)) {
    return new SafeCar(brand); // called without new? fix it
  }
  this.brand = brand;
}

const c3 = SafeCar("BMW");    // no new — still works
const c4 = new SafeCar("Audi"); // with new — works too
console.log(c3.brand); // "BMW"
console.log(c4.brand); // "Audi"


// ─────────────────────────────────────────────
// 6. CONSTRUCTOR WITH DEFAULT VALUES
// ─────────────────────────────────────────────

console.log("\n=== 6. DEFAULT VALUES ===");

function Config(host, port, ssl) {
  this.host = host || "localhost";
  this.port = port || 3000;
  this.ssl  = ssl  ?? false;
}

const cfg1 = new Config();
const cfg2 = new Config("example.com", 443, true);

console.log(cfg1); // Config { host: 'localhost', port: 3000, ssl: false }
console.log(cfg2); // Config { host: 'example.com', port: 443, ssl: true }



// ─────────────────────────────────────────────
// 8. INHERITANCE WITH CONSTRUCTOR FUNCTIONS
//    Before ES6 classes — manual prototype chaining
// ─────────────────────────────────────────────

console.log("\n=== 8. INHERITANCE ===");

// Parent
function Animal(name, sound) {
  this.name  = name;
  this.sound = sound;
}

Animal.prototype.speak = function () {
  console.log(`${this.name} says ${this.sound}`);
};

// Child
function Dog(name, breed) {
  Animal.call(this, name, "Woof"); // Step 1: call parent constructor
  this.breed = breed;
}

// Step 2: link Dog.prototype → Animal.prototype
Dog.prototype = Object.create(Animal.prototype);

// Step 3: fix constructor reference (broken by step 2)
Dog.prototype.constructor = Dog;

// Add Dog-specific method
Dog.prototype.fetch = function () {
  console.log(`${this.name} fetches the ball!`);
};

const dog = new Dog("Rex", "Labrador");
dog.speak();  // "Rex says Woof"  — inherited from Animal
dog.fetch();  // "Rex fetches the ball!" — own method

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true — chain works


// ─────────────────────────────────────────────
// 9. ES6 CLASS — SAME THING, CLEANER SYNTAX
//    Classes are syntactic sugar over constructor
//    functions. Same prototype chain underneath.
// ─────────────────────────────────────────────

console.log("\n=== 9. ES6 CLASS (same under the hood) ===");

class Vehicle {
  constructor(make, model, year) {
    this.make  = make;
    this.model = model;
    this.year  = year;
  }

  // Goes on Vehicle.prototype automatically
  describe() {
    return `${this.year} ${this.make} ${this.model}`;
  }

  // Static method — on the class itself, not instances
  static compare(v1, v2) {
    return v1.year - v2.year; // sort by year
  }
}

class ElectricVehicle extends Vehicle {
  constructor(make, model, year, range) {
    super(make, model, year); // calls Vehicle constructor
    this.range = range;
  }

  describe() {
    return `${super.describe()} — Electric, range: ${this.range}km`;
  }
}

const v1 = new Vehicle("Toyota", "Camry", 2020);
const v2 = new ElectricVehicle("Tesla", "Model 3", 2023, 500);

console.log(v1.describe()); // "2020 Toyota Camry"
console.log(v2.describe()); // "2023 Tesla Model 3 — Electric, range: 500km"
console.log(Vehicle.compare(v1, v2)); // -3 (v1 is older)

// Proof: class is just a constructor function underneath
console.log(typeof Vehicle); // "function" — not a special type


// ─────────────────────────────────────────────
// 10. CONSTRUCTOR vs FACTORY FUNCTION
//     Two ways to create objects — different tradeoffs
// ─────────────────────────────────────────────

console.log("\n=== 10. CONSTRUCTOR vs FACTORY ===");

// Constructor — uses new, prototype chain, instanceof works
function ConstructorUser(name) {
  this.name = name;
}
ConstructorUser.prototype.greet = function () {
  return `Hi, I am ${this.name}`;
};
const cu = new ConstructorUser("Umer");
console.log(cu instanceof ConstructorUser); // true
console.log(cu.greet()); // "Hi, I am Umer"

// Factory — plain function, returns plain object, no new needed
function createUser(name) {
  return {
    name,
    greet() { return `Hi, I am ${name}`; }, // closure, not prototype
  };
}
const fu = createUser("Umer");
console.log(fu instanceof Function); // false — plain object
console.log(fu.greet()); // "Hi, I am Umer"

/*
  CONSTRUCTOR                   FACTORY
  ─────────────────────────────────────────
  Needs `new`                   No `new`
  `this` based                  Returns object explicitly
  Prototype chain               No prototype chain
  instanceof works              instanceof won't work
  Risk: forgetting `new`        No such risk
  Memory efficient (prototype)  Each object has own methods
*/


// ============================================================
//  QUICK REFERENCE
// ============================================================
//
//  new Fn()     → create object → link to Fn.prototype → run constructor → return this
//  this         → the new instance being built
//  prototype    → shared method storage — defined once, used by all
//  instanceof   → checks prototype chain
//  super()      → calls parent constructor (ES6 classes)
//  static       → method on class itself, not on instances
//
//  Rule: Properties that differ per instance   → inside constructor (this.x)
//        Methods shared by all instances        → on prototype / class body
//
// ============================================================