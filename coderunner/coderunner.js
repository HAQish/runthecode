const Sandbox = require('sandbox');
var s = new Sandbox();

var runThis = function(userCode, tests) {
  console.log('TESTS in runthis are', tests)
  var masterTests = tests; // need hardcoded tests here for initial test
  return new Promise(resolve => { 
    s.run(`${userCode} ${masterTests};`, function(output) {
      console.log('output in runthis = ', output.result);
      resolve(output.result);
    })
  });
}

module.exports.runThis = runThis;