const Sandbox = require('sandbox');
var s = new Sandbox();
s.options.timeout = 1500;
// onmessage = undefined;
var runThis = function(userCode, tests) {
  var masterTests = tests;
  return new Promise(resolve => {
    s.run(`${userCode} ${masterTests};`, function(output) {
      console.log("Output in runThis in coderunner.js", output);
      resolve(output.result);
    })
  });
}

module.exports.runThis = runThis;

// describe("string", function() {
//   var answer = function()
//   expect.answer.toBe(7);
// })