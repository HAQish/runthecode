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

  app.post("/challengeSolution", function(req, res) { // sending code from editor in app to be run in sandbox
    console.log('😈 in post to challengeSolution', req.body);
    var masterTestResults;
    var endMsg;
    var message = "Success";
    var codeResult = runThis(req.body.masterUserSolutionCode, req.body.masterTests).
    then(async (data) => {
      if (data[0] === "'" || data === "TimeoutError") {
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
      console.log("further down in post to challengeSolution, after returned from coderunner", masterTestResults, message);
      if (req.body.challengeLevel) { // if not undefined, then it's a course challenge, so must save completed problems
        //assuming req.body.challengeName is the challengeName and req.user is the user
        console.log('IN CHALLENGE LEVEL UPDATE');
        console.log('req.user->', req.user);
        var user = await db.updateCompletedCourseChallenges(req.user, message, req.body.challengeName);
        console.log('updated user in challengesolution ->', user);
      }

      endMsg = JSON.stringify({masterTestResults: masterTestResults, message: message, user: user});
      res.end(endMsg);
    })
    .catch(err => console.log('error in challengeSolution', err))
  })

  app.get("/initialChallenges", function(req, res) { // gets initial five challenges from database
    console.log("Heard get for initial challenges from app");
    db.selectAllInitialChallenges().then(results => {console.log("results being sent from get to initialChallenges", results); res.send(results)});
  });


  app.post("/initialChallenges", function(req, res) { // sets flag on user document to show initial challenges are complete and sets score
    console.log('hit initialchallenge post, req.body is:', req.body);
    console.log("to test the session, req.user is ", req.user);
    db.updateUserLevel(req.body.user.username, req.body.initialScore)
      .then(results => {console.log("results being sent back from post to initialChallenges", results); res.send(results);});
  })

  app.get("/courseChallenges", function(req, res) { // gets all course challenges from the database
    console.log("Heard get for all course challenges from app");
    db.getAllCourseChallenges().then(results => {console.log(results); res.send(results)});
  })

  // app.post("/createInitialChallenge", function(req, res) { // to create initial challenge, perhaps later in the app itself for admins
  //   console.log("Heard post for new initial challenge, new challenge is ", req.body);
  //   db.addNewInitialChallenge(req.body);
  // })



//User submitted challenge routes
  app.post("/userSubmittedChallenge", function(req, res) { // create new user submitted challenge
    console.log("Heard post for user submitted challenge, req.body is ", req.body);
    db.addUserChallenge(req.body);
  })

  app.get("/userSubmittedChallenge/:challengeName", function(req, res) { // find user submitted challenge by name
    console.log("Heard get for user submitted challenge, challenge name is ", req.params.challengeName);
    db.getUserChallengeByName(req.params.challengeName).then(results => console.log(results));
  })

  // app.get("/challenges/next", function(req, res) { // assuming currentChallenge is in req.body
  //   console.log("Heard get for next challenge");
  //   console.log(req.body.currentChallenge);

  // })

  // app.get("/getTail", function(req, res) {
  //   console.log("Heard get for tail of initial challenges linked list in db");
  //   db.getTailOfLinkedList().then(results => console.log(results));
  // })

  // app.get("/getHead", function(req, res) {
  //   console.log("Heard get for head of initial challenges linked list in db");
  //   db.getHeadOfLinkedList().then(results => console.log(results));
  // })
}



////// OTHER DB ROUTES //////

var dbRoutes = function(app) {
  // app.post("/createUser", function(req, res) { // deprecated, passport has its own method it calls on login and signup
  //   console.log("heard posted user from app, and the posted user is ", req.body);
  //   db.addUser(req.body);
  // })

  app.post("/addSolution", function(req, res) { // adds solution to solution collection in database, adds solution id to user and challenge
    console.log("heard posted solution from app, and the posted solution is ", req.body);
    db.addSolution(req.body, "testUser1", "testChallenge1"); // hard-coded for now
  })

  app.get("/populatedUser", function(req, res) { // retrieves that particular user and populates the solution field with the solution ids in place
    db.getPopulatedUser("testUser1")
      .then(function(results) {console.log("in server-index, get route, the results from the populatedUser are ", results)});
  })

  app.get("/populatedChallenge", function(req, res) { // retrieves that particular challenge and populates the solution field with the solution ids in place
    db.getPopulatedChallenge("testChallenge1")
      .then(function(results) {console.log("in server-index, get route, the results from the populatedChallenge are ", results)});
  })
}

module.exports.passportRoutes = passportRoutes;
module.exports.challengeRoutes = challengeRoutes;
module.exports.dbRoutes = dbRoutes;