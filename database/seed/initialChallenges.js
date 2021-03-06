const arr = [
  {
    prompt: "Write a function called helloWorld that Returns the string 'Hello World' using two variables example: helloWorld() // returns 'Hello World'",
    starterCode: "function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }",
    masterTests: "[typeof helloWorld === 'function', helloWorld() === 'Hello World']",
    masterTestDescriptions: "['helloWorld should be a function', 'return value should be Hello World']",
    challengeNumber: 1,
    challengeName: 'Hello World!',
  },
  {
    prompt: "Write a function called oldEnough that takes a number(age) and a string('drink' or 'drive') \n and returns a custom message with whether the person is old enough to do the activity passed in \n testDrive1 = oldEnough(14, 'drive') // 'Sorry, you're not old enough to drive.' \n testDrive2 = oldEnough(20, 'drive') // 'Yes! You're old enough to drive!' \n testDrink1 = oldEnough(18, 'drink') // 'Sorry, you're not old enough to drink.' \n testDrink2 = oldEnough(30, 'drink') // 'Yes! You're old enough to drink!' \n testEdge = oldEnough(32, 'dance') // 'You're always old enough to dance!'",
    starterCode: 'function oldEnough(age, activity) { \n \n };',
    masterTests: "[typeof oldEnough === 'function', oldEnough(10, 'play') === 'Youre always old enough to play!', oldEnough(15, 'drive') === 'Sorry, youre not old enough to drive.', oldEnough(16, 'drive') === 'Yes! Youre old enough to drive!', oldEnough(20, 'drink') === 'Sorry, youre not old enough to drink.', oldEnough(21, 'drink') === 'Yes! Youre old enough to drink!']",
    masterTestDescriptions: "['oldEnough should be a function', 'A ten-year-old is old enough to play', 'A 15-year-old is not old enough to drive', 'A 16-year-old is old enough to drive', 'A 20-year-old is not old enough to drink', 'A 21-year-old is old enough to drink']",
    challengeNumber: 2,
    challengeName: 'Old Enough?',
  },
  {
    prompt: 'write a function called compareTriangleAndCircle that takes 3 arguments, 2 numbers for the base and a height of the triangle and a number corresponding to the radius of a circle, compute the areas of both circle and triangle, and return which area is larger \n hint: the area of a circle is PI r^2',
    starterCode: 'function compareTriangleAndCircle(base, height, radius) { \n \n }',
    masterTests: "[typeof compareTriangleAndCircle === 'function', compareTriangleAndCircle(3,4,3) === 'Circle', compareTriangleAndCircle(12,24,6.5) === 'Triangle', compareTriangleAndCircle(10,10,5) === 'Circle', compareTriangleAndCircle(5,21,4) === 'Triangle', compareTriangleAndCircle(254,51,50) === 'Circle']",
    masterTestDescriptions: "['compareTriangleAndCircle should be a function', 'Between a 3, 4 triangle and a circle of radius 3, the circle is bigger', 'Between a 12, 24 triangle and a circle of radius 6.5, the triangle is bigger', 'Between a 10, 10 triangle and a circle of radius 5, the circle is bigger', 'Between a 5, 21 triangle and a circle of radius 4, the triangle is bigger', 'Between a 254, 51 triangle and a circle of radius 50, the circle is bigger']",
    challengeName: 'Compare triangle and circle',
    challengeNumber: 3,
  },
  {
    prompt: 'Write a function joinObjects that takes in 2 different objects and adds the properties of the 2nd object to the first and then returns the first object with the new properties attached \n If the 1st object already has a given key, ignore it (do not overwrite the property value).  Do not change the second object.',
    starterCode: 'function joinObjects(obj1, obj2) { \n \n }',
    masterTests: "[typeof joinObjects === 'function', typeof joinObjects({1: 1}, {2: 2}) === 'object' && !Array.isArray(joinObjects({1: 1}, {2: 2})), joinObjects({1: 1}, {2: 2})[1] === 1 && joinObjects({1: 1}, {2: 2})[2] === 2, joinObjects({1: 1}, {1: 5, 2: 2})[1] === 1 && joinObjects({1: 1}, {1: 5, 2: 2})[2] === 2]",
    masterTestDescriptions: "['joinObjects should be a function', 'return value should be an object', 'should join separate objects into one', 'should not overwrite first object']",
    challengeName: 'Join Objects',
    challengeNumber: 4,
  },
  {
    prompt: 'write a recursive function fibonacci that takes an integer n and returns the nth number of the fibonacci sequence \n hint - the fibonacci sequence calculates each number by the sum of the two numbers before it \n ex. 0, 1, 1, 2, 3, 5, 8, 13, 21, 34',
    starterCode: 'function fibonacci(n) { \n \n }',
    masterTests: "[typeof fibonacci === 'function', typeof fibonacci(n) === 'number', fibonacci(0) === 0, fibonacci(1) === 1, fibonacci(2) === 1, fibonacci(3) === 2, fibonacci(10) === 55, fibonacci(20) === 6765, fibonacci(40) === 102334155]",
    masterTestDescriptions: "['fibonacci should be a function', 'fibonacci should return a number', 'the 0th fibonacci number is 0', 'the 1st fibonacci number is 1', 'the 2nd fibonacci number is 1', 'the 3rd fibonacci number is 2', 'the 10th fibonacci number is 55', 'the 20th fibonacci number is 6765', 'the 40th fibonacci number is 102334155']",
    challengeName: 'Fibonacci',
    challengeNumber: 5,
  },
];

module.exports.arr = arr;
