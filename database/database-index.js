const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //adds pre-save validation for unique fields within a Mongoose schema.
const passportLocalMongoose = require('passport-local-mongoose'); //simplifies building username and password login with Passport.
const bcrypt = require('bcrypt'); // handles password hashing in the database
const saltRounds = 5;
let Schema = mongoose.Schema;
let uristring = process.env.MONGODB_URI || 'mongodb://localhost:27017/levelup';


mongoose.connect(uristring, (err) => { // creating connection to mongod
  if (err) { console.log('mongodb not connected', err); }
  else {
    console.log('connected to database');
  }
});

var db = mongoose.connection;

db.on('error', function(err) { // error message on mongod connection
  console.log('mongoose connection error', err);
});

db.once('open', function() { // success message on mongod connection
  console.log('mongoose connected successfully');
});

var initialChallengeSchema = new Schema({
  prompt: String,
  starterCode: String,
  masterTests: String,
  masterTestDescriptions: String,
  challengeNumber: Number,
  challengeName: String
})

var InitialChallenges = mongoose.model("InitialChallenges", initialChallengeSchema);

var userSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  username: { type: String, unique: true },
  local: {
    email: String,
    password: String
  },
  level: String, // changed to string from number for now
  experience: String, // changed to string from number for now
  score: String, // changed to string from number for now
  completedChallenges: [{type: Schema.Types.ObjectId, ref: 'Solutions'}]
})

var Users = mongoose.model("Users", userSchema);

 // ^^^^^^ Users ^^^^^^^

 // VVVVVVV Challenges VVVVVV

 //strings -> numbers --- example: level: {type: Number, default: 0}

var challengeSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  challengeName: String,
  createdBy: String,
  categories: Array,
  prompt: String,
  exampleTests: Array,
  finalTests: Array,
  resources: [{
    resourceName: String,
    resourceUrl: String
  }],
  hints: [{
    text: String,
    deductionValue: String // changed to string from number for now
  }],
  masterSolution: String,
  submittedSolutions: [{type: Schema.Types.ObjectId, ref: 'Solutions'}],
  maxScore: String, // changed to string from number for now
  difficulty: String // changed to string from number for now
})

var Challenges = mongoose.model("Challenges", challengeSchema);

 // ^^^^^^^ Challenges ^^^^^^^^^

 // VVVVVVVV Solutions VVVVVVVVV

var solutionsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  createdAt: {type: Date, default: Date.now},
  challengeName: String,
  prompt: String,
  createdBy: String,
  solvedBy: String,
  score: String, // changed to string from number for now
  rating: String, // changed to string from number for now
  code: String,
  comments: [{
    user: String,
    comment: String
  }]
})

var Solutions = mongoose.model("Solutions", solutionsSchema);

 // ^^^^^^^^ Solutions ^^^^^^^^^

var addUser = function(obj) {
  var newUser = new Users(obj);
  console.log("The new user being saved to the users collection in addUser in database-index is ", newUser);
  return newUser.save();
}

var addChallenge = function(obj) {
  var newChallenge = new Challenges(obj);
  console.log("The new challenge being saved to the challenges collection in addChallenge in database-index is ", newChallenge);
  return newChallenge.save();
}

var addSolution = function(obj, username, challengeName) { // adds to solutions collection and adds id to users and challenges collections
  var newSolution = new Solutions(obj);
  newSolution._id = new mongoose.Types.ObjectId();
  console.log("The new solution being saved to the solutions collection in addSolution in database-index is ", newSolution);

  newSolution.save(function(err) { // now, we need to save the ID to the supplied user
    return Users.findOne({username: username}, function(err, user) {
      if (err) {return err;}

      user.completedChallenges = user.completedChallenges.concat(newSolution._id);
      console.log("in addSolution in database-index, added newSolution with id ", newSolution._id, "to user ", user.username);

      user.save(function(err) { // now, we need to save the ID to the supplied challenge
        Challenges.findOne({challengeName: challengeName}, function(err, challenge) {
          if (err) {return err;}

          challenge.submittedSolutions = challenge.submittedSolutions.concat(newSolution._id);
          console.log("in addSolution in database-index, added newSolution with id ", newSolution._id, "to challenge ", challenge.challengeName);
          return challenge.save();
        })
      })
    })
  })
}

var selectAllChallenges = function() {
  return Challenges.find();
}

var getPopulatedUser = function(username) { // changes object ids into actual objects from other collection
  return new Promise(function(resolve, reject) {
    return Users.find({username: username}).populate("completedChallenges").exec(function(err, data) {
      if (err) {return err}
      console.log("data.completedChallenges in getPopulatedUser in database-index is ", data[0].completedChallenges);
      resolve(data[0].completedChallenges);
    })

  })
}

var getPopulatedChallenge = function(challengeName) { // changes object ids into actual objects from other collection
  return new Promise(function(resolve, reject) {
    return Challenges.find({challengeName: challengeName}).populate("submittedSolutions").exec(function(err, data) {
      if (err) {return err}
        console.log("data.submittedSolutions in getPopulatedChallenge in database-index is ", data[0].submittedSolutions);
        resolve(data[0].submittedSolutions);
    })

  })
}

// module.exports for each function
module.exports.addUser = addUser;
module.exports.addChallenge = addChallenge;
module.exports.addSolution = addSolution;
module.exports.selectAllChallenges = selectAllChallenges;
module.exports.getPopulatedUser = getPopulatedUser;
module.exports.getPopulatedChallenge = getPopulatedChallenge;
module.exports.Users = Users;
module.exports.InitialChallenges = InitialChallenges;

















































