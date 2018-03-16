const {VM} = require('vm2');
const vm = new VM();

var runThis = function(userCode) {
  return vm.run(userCode);
};

module.exports.runThis = runThis;