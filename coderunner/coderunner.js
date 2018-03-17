const Sandbox = require('sandbox');
var s = new Sandbox();

var runThis = function(userCode) {
  masterTests = "[addFunc(1,2) === 3, addFunc(1,2) === 3];"; // need hardcoded tests here for initial test
  return new Promise(resolve => { 
    s.run(`${userCode} ${masterTests};`, function(output) {
      console.log('output in runthis = ', output);
      resolve(output);
    })
  });
}

module.exports.runThis = runThis;