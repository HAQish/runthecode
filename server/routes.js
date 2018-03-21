const Users = require('../database/database-index.js').Users
const runThis = require('../coderunner/coderunner.js').runThis;
const db = require('../database/database-index.js');

///////// PASSPORT ROUTES /////////

var passportRoutes = function(app, passport) {
  require('../config/passport.js')(passport);
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

/////// CHALLENGE ROUTES ///////

var challengeRoutes = function(app) {
  //Challenge solution submission routes
  app.post("/challengeSolution", function(req, res) {
    console.log('😈', req.body);
    var masterTestResults;
    var endMsg;
    var message = "Success";
    var codeResult = runThis(req.body.masterUserSolutionCode, req.body.masterTests).
    then((data) => {
      if (data[0] === "'") {
        message = 'Error';
        masterTestResults = data;
      } else {
        console.log('DATA RESULTS', data);
        var resultArray = JSON.parse(data);
        masterTestResults = resultArray;
        for (var i = 0; i < resultArray.length; i++) {
          if (resultArray[i] === false) {
            message = "Failure";
            break;
          }
        }
      }
      console.log(masterTestResults, message);
      endMsg = JSON.stringify({masterTestResults: masterTestResults, message: message});
      res.end(endMsg);
    // res.end(codeResult);
    //if all true -- save submission to db(their answer, score)
    //if not all true, update db with deduction -- send array of booleans
      //front end interprets booleans and renders descriptions
    })
    .catch(err => console.log('error in challengeSolution', err))
  })

  app.get("/initialChallenges", function(req, res) {
    console.log("Heard get for initial challenges from app");
    db.selectAllInitialChallenges().then(results => res.send(results));
  });


  app.get("/challenges/next", function(req, res) { // assuming currentChallenge is in req.body
    console.log("Heard get for next challenge");
    console.log(req.body.currentChallenge);

  })


  app.get("/challenges/:challengeName", function(req, res) {
    console.log("Heard get for challenge", req.params.challengeName);
    db.getChallengeByName(req.params.challengeName).then(results => console.log(results));
  })


}



////// HABIB DB ROUTES //////

var dbRoutes = function(app) {
  app.post("/createUser", function(req, res) {
    console.log("heard posted user from app, and the posted user is ", req.body);
    db.addUser(req.body);
  })

  app.post("/createChallenge", function(req, res) {
    console.log("heard posted challenge from app, and the posted challenge is ", req.body);
    db.addChallenge(req.body);
  })

  app.post("/addSolution", function(req, res) {
    console.log("heard posted solution from app, and the posted solution is ", req.body);
    db.addSolution(req.body, "testUser1", "testChallenge1");
  })

  app.get("/populatedUser", function(req, res) {
    db.getPopulatedUser("testUser1")
      .then(function(results) {console.log("in server-index, get route, the results from the populatedUser are ", results)});
  })

  app.get("/populatedChallenge", function(req, res) {
    db.getPopulatedChallenge("testChallenge1")
      .then(function(results) {console.log("in server-index, get route, the results from the populatedChallenge are ", results)});
  })
}

module.exports.passportRoutes = passportRoutes;
module.exports.challengeRoutes = challengeRoutes;
module.exports.dbRoutes = dbRoutes;