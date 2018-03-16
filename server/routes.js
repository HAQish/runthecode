var Users = require('../database/database-index.js').Users
var runThis = require('../coderunner/coderunner.js').runThis;
var passportRoutes = function(app, passport) {

  //Sign up routes
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signupSuccess',
    failureRedirect: '/signupFailure',
    failureFlash: true,
    successFlash: true
  }));
  app.get('/signupSuccess', function(req, res) {
    res.send(req.flash('User'));
  });
  app.get('/signupFailure', function(req, res) {
    res.send({message: req.flash('signupMessage')});
  });

  //Login routes
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure',
    failureFlash: true,
    successFlash: true
  }));
  app.get('/loginSuccess', function(req, res) {
    res.send(req.flash('User'));
  });
  app.get('/loginFailure', function(req, res) {
    res.send({message: req.flash('loginMessage')});
  });

  //Logout route
  app.get('/logout', function(req, res) {
    req.logout();
    res.end('Logged out successfully');
  });
}

var challengeRoutes = function(app) {
  //Challenge solution submission routes
  app.post("/challengeSolution", function(req, res) {
    var codeResult = runThis(req.body.currentUserSolutionCode);
    console.log(codeResult);
    res.end(JSON.stringify(codeResult));
    /* 
    example of vm.run: 
      console.log(runThis('var testFunc = function(x, y) {var result = x + y; return result}; testFunc(3,4)'));
    */
   //
  })
}

module.exports.passportRoutes = passportRoutes;
module.exports.challengeRoutes = challengeRoutes;