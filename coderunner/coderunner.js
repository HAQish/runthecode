const Sandbox = require('sandbox');
var s = new Sandbox();

var runThis = function(userCode, tests) {
  var masterTests = tests;
  return new Promise(resolve => { 
    s.run(`${userCode} ${masterTests};`, function(output) {
      resolve(output.result);
    })
  });
}

module.exports.runThis = runThis;