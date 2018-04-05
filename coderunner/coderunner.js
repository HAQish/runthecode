const Sandbox = require('sandbox');

const s = new Sandbox();
s.options.timeout = 1500;
// onmessage = undefined;
const runThis = function (userCode, tests) {
  const masterTests = tests;
  return new Promise((resolve) => {
    s.run(`${userCode} ${masterTests};`, (output) => {
      console.log('Output in runThis in coderunner.js', output);
      resolve(output.result);
    });
  });
};

module.exports.runThis = runThis;

// describe("string", function() {
//   var answer = function()
//   expect.answer.toBe(7);
// })
