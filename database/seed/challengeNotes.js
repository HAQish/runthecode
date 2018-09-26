// These are the initial 5 challenges they will have to pass and the assertion tests that will be run against each of them
/*
  CHALLENGE 1 - helloWorld
  Write a function called helloWorld that
  Returns the string 'Hello World' using two variables
  test = helloWorld() // 'Hello World'
*/
// solution
function helloWorld() {
  const hello = 'Hello';
  const world = 'World';
  return `${hello} ${world}`;
}
const solutionArray1 = "[typeof helloWorld === 'function', helloWorld() === 'Hello World']";
const testDescriptionArray1 = "['helloWorld should be a function', 'return value should be Hello World']";
/** ************************************************************************** */
/*
  CHALLENGE 2 - oldEnough
  Write a function called oldEnough that takes a number(age) and a string('drink' or 'drive')
  and returns a custom message with whether the person is old enough to do the activity passed in
  testDrive1 = oldEnough(14, 'drive') // 'Sorry, you're not old enough to drive.'
  testDrive2 = oldEnough(20, 'drive') // 'Yes! You're old enough to drive!'
  testDrink1 = oldEnough(18, 'drink') // 'Sorry, you're not old enough to drink.'
  testDrink2 = oldEnough(30, 'drink') // 'Yes! You're old enough to drink!'
  testEdge = oldEnough(32, 'dance') // 'You're always old enough to dance!'
  describe("oldEnough", function() {
    it("should return a string", function() {
      expect(typeof oldEnough(40, 'drink')).toEqual("string");
    });
    it("should return the correct string for the activity of drink", function() {
      expect(oldEnough(40, 'drink')).toEqual('Yes! You're old enough to drink!');
    });
    it("should return the correct string for the activity of drive", function() {
      expect(oldEnough(14, 'drive')).toEqual('Sorry, you're not old enough to drive.');
    });
  });
*/
// solution
function oldEnough(age, activity) {
  const no = `Sorry, you are not old enough to ${activity}.`;
  const yes = `Yes! You are old enough to ${activity}!`;
  const other = `You are always old enough to ${activity}!`;
  if (activity === 'drink') {
    if (age < 21) {
      return no;
    }
    return yes;
  } else if (activity === 'drive') {
    if (age < 16) {
      return no;
    }
    return yes;
  }
  return other;
}
const solutionArray2 = '[typeof oldEnough === "function", oldEnough(10, "play") === "You\'re always old enough to play!", oldEnough(15, "drive") === "Sorry, you\'re not old enough to drive.", oldEnough(16, "drive") === "Yes! You\'re old enough to drive!", oldEnough(20, "drink") === "Sorry, you\'re not old enough to drink.", oldEnough(21, "drink") === "Yes! You\'re old enough to drink!"]';
const testDescriptionArray2 = '["oldEnough should be a function", "A ten-year-old is old enough to play", "A 15-year-old is not old enough to drive", "A 16-year-old is old enough to drive", "A 20-year-old is not old enough to drink", "A 21-year-old is old enough to drink"]';
/** ************************************************************************** */
/*
  CHALLENGE 3 - compareTriangleAndCircle
  write a function called compareTriangleAndCircle that takes 3 arguments, 2 numbers for the base and a height of the triangle
  and a number corresponding to the radius of a circle
  and compute the areas of both circle and triangle and return which area is larger
  hint: the area of a circle is PI x r^2
  test1 = compareTriangleAndCircle(3,4,3) // 6 28.27 'Circle'
  test2 = compareTriangleAndCircle(12,24,6.5) // 144 132.73 'Triangle'
  test3 = compareTriangleAndCircle(10,10,5) // 50 78.54 'Circle'
  test4 = compareTriangleAndCircle(5,21,4) // 52.5 50.27 'Triangle'
  test5 = compareTriangleAndCircle(254,51,50) // 6477 7853.98 'Circle'
  describe("computeAreaOfATriangle", function() {
    it("should return a number", function() {
      expect(typeof computeAreaOfATriangle(6, 4)).toBe("number");
    });
    it("should return the area of a triangle", function() {
      expect(computeAreaOfATriangle(6, 4)).toBe(12);
    });
  });
*/
// solution
function compareTriangleAndCircle(base, height, radius) {
  const triArea = base * height / 2;
  const circleArea = Math.PI * Math.pow(radius, 2);
  if (triArea > circleArea) {
    return 'Triangle';
  }
  return 'Circle';
}
const solutionArray3 = '[typeof compareTriangleAndCircle === "function", compareTriangleAndCircle(3,4,3) === "Circle", compareTriangleAndCircle(12,24,6.5) === "Triangle", compareTriangleAndCircle(10,10,5) === "Circle", compareTriangleAndCircle(5,21,4) === "Triangle", compareTriangleAndCircle(254,51,50) === "Circle"]';
const testDescriptionArray3 = '["compareTriangleAndCircle should be a function", "Between a 3, 4 triangle and a circle of radius 3, the circle is bigger", "Between a 12, 24 triangle and a circle of radius 6.5, the triangle is bigger", "Between a 10, 10 triangle and a circle of radius 5, the circle is bigger", "Between a 5, 21 triangle and a circle of radius 4, the triangle is bigger", "Between a 254, 51 triangle and a circle of radius 50, the circle is bigger"]';
/** ************************************************************************** */
/*
  CHALLENGE 4 -
  Write a function joinObjects that takes in 2 different objects and adds the properties of the 2nd object to the first
  then return the first object with the new properties attached
  If the 1st object already has a given key, ignore it (do not overwrite the property value).
  Do not change the second object
  test1 =
  test2 =
  test3 =
  test4 =
  test5 =
  describe("joinObjects", function() {
    it("should extend the first object with unrepresented properties from the second object", function() {
      var obj1 = {
        a: 1,
        b: 2
      };
      var obj2 = {
        b: 4,
        c: 3,
        d: 75
      };
      var result = {
        a: 1,
        b: 2,
        c: 3,
        d: 75
      };
      const test1 = joinObjects(obj1, obj2);
      expect(test1).toEqual(result);
    });
    it("should not alter the 2nd object", function() {
      var obj1 = {
        a: 1,
        b: 2
      };
      var obj2 = {
        b: 4,
        c: 3
      };
      extend(obj1, obj2);
      expect(obj2).toEqual({b: 4, c: 3});
    });
  });
*/
// solution
function joinObjects(obj1, obj2) {
  Object.keys(obj2).forEach((key) => {
    if (obj1[key]) {
      obj1[key] = obj1[key];
    } else {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
}
const solutionArray4 = '[typeof joinObjects === "function", typeof joinObjects({1: 1}, {2: 2}) === "object" && !Array.isArray(joinObjects({1: 1}, {2: 2})), joinObjects({1: 1}, {2: 2})[1] === 1 && joinObjects({1: 1}, {2: 2})[2] === 2, joinObjects({1: 1}, {1: 5, 2: 2})[1] === 1 && joinObjects({1: 1}, {1: 5, 2: 2})[2] === 2]';
const testDescriptionArray4 = '["joinObjects should be a function", "return value should be an object", "should join separate objects into one", "should not overwrite first object"]';
/** ************************************************************************** */
/*
  CHALLENGE 5 -
  write a recursive function fibonacci that takes an integer n and returns the nth number of the fibonacci sequence
  hint: the fibonacci sequence calculates each number by the sum of the two numbers before it
    ex. 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
  test1 =
  test2 =
  test3 =
  test4 =
  test5 =
*/
// solution
function fibonacci(n) {
  if (n === 0) {
    return 0;
  } else if (n === 1 || n === 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
const solutionArray5 = '[typeof fibonacci === "function", typeof fibonacci(n) === "number", fibonacci(0) === 0, fibonacci(1) === 1, fibonacci(2) === 1, fibonacci(3) === 2, fibonacci(10) === 55, fibonacci(20) === 6765, fibonacci(40) === 102334155]';
const testDescriptionArray5 = '["fibonacci should be a function", "fibonacci should return a number", "the 0th fibonacci number is 0", "the 1st fibonacci number is 1", "the 2nd fibonacci number is 1", "the 3rd fibonacci number is 2", "the 10th fibonacci number is 55", "the 20th fibonacci number is 6765", "the 40th fibonacci number is 102334155"]';
/** ************************************************************************** */
/*
  CHALLENGE 6 - BubbleSort
  write a function bubbleSort that takes an array of numbers and sorts them from smallest to largest.
  * Bubble sort is the most basic sorting algorithm in all of Computer
  * Sciencedom. It works by starting at the first element of an array and
  * comparing it to the second element; if the first element is greater than the
  * second element, it swaps the two. It then compares the second to the third,
  * and the third to the fourth, and so on; in this way, the largest values
  * "bubble" to the end of the array. Once it gets to the end of the array, it
  * starts over and repeats the process until the array is sorted numerically.
  test1 =
  test2 =
  test3 =
  test4 =
  test5 =
*/
// solution
