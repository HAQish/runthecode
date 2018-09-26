const Users = require('../database/database-index.js').Users;
const runThis = require('../coderunner/coderunner.js').runThis;
const db = require('../database/database-index.js');
const path = require('path');

// /////// PASSPORT ROUTES /////////

const passportRoutes = function (app, passport) {
  require('../config/passport.js')(passport);
  // Sign up routes
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signupSuccess',
    failureRedirect: '/signupFailure',
    failureFlash: true,
    successFlash: true,
  }));
  app.get('/signupSuccess', (req, res) => {
    res.send(req.flash('User'));
  });
  app.get('/signupFailure', (req, res) => {
    res.send({
      message: req.flash('signupMessage')
    });
  });

  // Login routes
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure',
    failureFlash: true,
    successFlash: true,
  }));
  app.get('/loginSuccess', (req, res) => {
    res.send(req.flash('User'));
  });
  app.get('/loginFailure', (req, res) => {
    res.send({
      message: req.flash('loginMessage')
    });
  });

  // Logout route
  app.get('/logout', (req, res) => {
    console.log('Logging out, current user before logout is ', req.user);
    req.logout();
    res.end('Logged out successfully');
  });
};

// ///// CHALLENGE ROUTES ///////

const challengeRoutes = function (app) {
  // Challenge solution submission routes
  app.post('/challengeSolution', (req, res) => { // sending code from editor in app to be run in sandbox
    console.log('😈 in post to challengeSolution', req.body);
    let masterTestResults;
    let endMsg;
    let message = 'Success';
    const codeResult = runThis(req.body.masterUserSolutionCode, req.body.masterTests)
      .then(async (data) => {
        if (data[0] === "'") {
          message = 'Error';
          masterTestResults = data;
        } else {
          console.log('DATA RESULTS', data);
          const resultArray = JSON.parse(data);
          masterTestResults = resultArray;
          for (let i = 0; i < resultArray.length; i++) {
            if (resultArray[i] === false) {
              message = 'Failure';
              break;
            }
          }
        }
        console.log(masterTestResults, message);
        if (req.body.challengeLevel) { // if not undefined, then it's a course challenge, so must save completed problems
          const user = await db.updateCompletedCourseChallenges(req.user, message, req.body.challengeName);
        }
        endMsg = JSON.stringify({
          masterTestResults,
          message
        });
        res.end(endMsg);
      })
      .catch(err => console.log('error in challengeSolution', err));
  });

  app.get('/initialChallenges', (req, res) => { // gets initial five challenges from database
    console.log('Heard get for initial challenges from app');
    db.selectAllInitialChallenges().then((results) => {
      console.log('results being sent from get to initialChallenges', results);
      res.send(results);
    });
  });

  app.post('/initialChallenges', (req, res) => { // sets flag on user document to show initial challenges are complete and sets score
    console.log('hit initialchallenge post, req.body is:', req.body);
    console.log('to test the session, req.user is ', req.user);
    db.updateUserLevel(req.body.user.username, req.body.initialScore)
      .then((results) => {
        console.log('results being sent back from post to initialChallenges', results);
        res.send(results);
      });
  });

  app.get('/courseChallenges', (req, res) => { // gets all course challenges from the database
    console.log('Heard get for all course challenges from app');
    db.getAllCourseChallenges().then((results) => {
      console.log(results);
      res.send(results);
    });
  });

  app.get('/challengeList', (req, res) => {
    console.log('Getting all challenge list for allChallenges front end route');
    db.getAllUserChallenges().then(results => res.send(results));
  });

  // app.post("/createInitialChallenge", function(req, res) { // to create initial challenge, perhaps later in the app itself for admins
  //   console.log("Heard post for new initial challenge, new challenge is ", req.body);
  //   db.addNewInitialChallenge(req.body);
  // })

  app.post('/allChallenges', (req, res) => {
    let masterTestResults;
    let endMsg;
    let message = 'Success';
    const codeResult = runThis(req.body.masterUserSolutionCode, req.body.masterTests)
      .then(async (data) => {
        if (data[0] === "'") {
          message = 'Error';
          masterTestResults = data;
        } else {
          console.log('DATA RESULTS', data);
          const resultArray = JSON.parse(data);
          masterTestResults = resultArray;
          for (let i = 0; i < resultArray.length; i++) {
            if (resultArray[i] === false) {
              message = 'Failure';
              break;
            }
          }
        }
        console.log(masterTestResults, message);
        if (message === 'Success') {
          // add to submitted solutions in challenge
          db.addSolution(req.body.masterUserSolutionCode, req.user.username, req.body.challengeName);
        }
        endMsg = JSON.stringify({
          masterTestResults,
          message
        });
        res.end(endMsg);
      })
      .catch(err => console.log('error in challengeSolution', err));
  });

  app.post('/rateSolution', (req, res) => {
    // needs (challengename, solver, rater, vote) from front end
    const rateMsg = db.rateSolution(req.body.challengeName, req.body.solver, req.user.username, req.body.vote)
      .then((z) => {
        console.log(z);
        res.send(z);
      });
  });

  // User submitted challenge routes
  app.post('/userSubmittedChallenge', (req, res) => {
    console.log('aaaaaaaaaa', req.body.user);
    const challenge = req.body.newChallenge;
    challenge.createdBy = req.body.user.username;
    const masterTests = challenge.masterTests;
    const masterSolution = challenge.masterSolution;
    let masterTestResults;
    let endMsg;
    let message = 'Success';
    const codeResult = runThis(masterSolution, masterTests)
      .then(async (data) => {
        if (data[0] === "'") {
          message = 'Error';
          masterTestResults = data;
        } else {
          console.log('DATA RESULTS', data);
          const resultArray = JSON.parse(data);
          masterTestResults = resultArray;
          for (let i = 0; i < resultArray.length; i++) {
            if (resultArray[i] === false) {
              message = 'Failure';
              break;
            }
          }
        }
        endMsg = JSON.stringify({
          masterTestResults,
          message
        });
        // on success
        if (message === 'Success') {
          db.addUserChallenge(challenge);
        }
        res.end(endMsg);
      })
      .catch(err => console.log('error in challengeSolution', err));
  });


  app.get('/userSubmittedChallenge/:challengeName', (req, res) => { // find user submitted challenge by name
    console.log('Heard get for user submitted challenge, challenge name is ', req.params.challengeName);
    db.getPopulatedChallenge(req.params.challengeName).then(results => res.send(results));
    // res.send(`Getting all challenges && ${req.params.challengeName}`);
  });

  app.get('/challengeList', (req, res) => { // find user submitted challenge by name
    // req.params.challengeName
    console.log('inside route, get all user challenges');
    db.getAllUserChallenges().then(results => res.send(results));
    // res.send('Getting all challenges');
    // send back array of all challenges.
  });

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
};


// //// OTHER DB ROUTES //////

const dbRoutes = function (app) {
  // app.post("/createUser", function(req, res) { // deprecated, passport has its own method it calls on login and signup
  //   console.log("heard posted user from app, and the posted user is ", req.body);
  //   db.addUser(req.body);
  // })

  app.post('/addSolution', (req, res) => { // adds solution to solution collection in database, adds solution id to user and challenge
    console.log('heard posted solution from app, and the posted solution is ', req.body);
    db.addSolution(req.body, 'testUser1', 'testChallenge1'); // hard-coded for now
  });

  app.get('/populatedUser', (req, res) => { // retrieves that particular user and populates the solution field with the solution ids in place
    db.getPopulatedUser('testUser1')
      .then((results) => {
        console.log('in server-index, get route, the results from the populatedUser are ', results);
      });
  });

  app.get('/populatedChallenge', (req, res) => { // retrieves that particular challenge and populates the solution field with the solution ids in place
    db.getPopulatedChallenge('testChallenge1')
      .then((results) => {
        console.log('in server-index, get route, the results from the populatedChallenge are ', results);
      });
  });

  app.get('/isLoggedIn', (req, res) => {
    if (req.user) {
      db.getPopulatedUser(req.user.username).then(results => res.send(results));
    } else {
      res.send(undefined);
    }
  });

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
};

module.exports.passportRoutes = passportRoutes;
module.exports.challengeRoutes = challengeRoutes;
module.exports.dbRoutes = dbRoutes;