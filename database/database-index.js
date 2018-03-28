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

// VVVVVVVVVVV Initial Challenges VVVVVVVVVVVVVVV

var initialChallengeSchema = new Schema({
  prompt: String,
  starterCode: String,
  masterTests: String,
  masterTestDescriptions: String,
  challengeNumber: Number,
  challengeName: {type: String, unique: true},
  next: String,
  previous: String
})

var InitialChallenges = mongoose.model("InitialChallenges", initialChallengeSchema, "initialChallenges");

// ^^^^^^^^^^^ Initial Challenges ^^^^^^^^^^^^^^

// VVVVVVVVVVVVV Course Challenges VVVVVVVVVVVVVVVVVVV

var courseChallengeSchema = new Schema({
  prompt: String,
  starterCode: String,
  masterTests: String,
  masterTestDescriptions: String,
  challengeLevel: Number,
  challengeNumber: Number,
  challengeName: {type: String, unique: true},
  next: String,
  previous: String
})

var CourseChallenges = mongoose.model("CourseChallenges", courseChallengeSchema, "courseChallenges");

// ^^^^^^^^^^^^^ Course Challenges ^^^^^^^^^^^^^^^^^^^

// VVVVVVVVVVVV User-submitted Challenges VVVVVVVVVVVVV

var userChallengeSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  starterCode: String,
  challengeName: String,
  challengeNumber: Number,
  createdBy: String,
  categories: Array,
  prompt: String,
  masterTests: String,
  masterTestDescriptions: String,
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
  // next: String, // removing linked list capabilities from user-submitted challenges for now
  // previous: String // removing linked list capabilities from user-submitted challenges for now
})

var UserChallenges = mongoose.model("UserChallenges", userChallengeSchema);

// ^^^^^^^^^^^^ User-submitted Challenges ^^^^^^^^^^^^^


// VVVVVVVVVVVVVVV Users VVVVVVVVVVVVVVVVVVVV

var userSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  username: { type: String, unique: true },
  local: {
    email: { type: String, unique: true },
    password: String
  },
  completedInitial: {type: Boolean, default: false},
  level: String, // changed to string from number for now
  experience: String, // changed to string from number for now
  score: String, // changed to string from number for now
  completedCourseChallenges: {type: Object, default: {}},
  completedChallenges: [{type: Schema.Types.ObjectId, ref: 'Solutions'}]
})

var Users = mongoose.model("Users", userSchema);

 // ^^^^^^ Users ^^^^^^^

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
  masterUserSolutionCode: String,
  difficulty: String,
  comments: [{
    user: String,
    comment: String
  }]
})

var Solutions = mongoose.model("Solutions", solutionsSchema);

 // ^^^^^^^^ Solutions ^^^^^^^^^

 //  VVVVVVVVVVVVV Linked List VVVVVVVVVVV

var initialChallengesLinkedListSchema = new Schema({
  position: {type: String, unique: true}, // head or tail
  idOfObject: String
});

var InitialChallengesLinkedList = mongoose.model("InitialChallengesLinkedList", initialChallengesLinkedListSchema, "initialChallengesLinkedList");

var courseChallengesLinkedListSchema = new Schema({
  position: {type: String, unique: true}, // head or tail
  idOfObject: String
})

var CourseChallengesLinkedList = mongoose.model("CourseChallengesLinkedList", courseChallengesLinkedListSchema, "courseChallengesLinkedList");

 // ^^^^^^^^^^^^^^ Linked List ^^^^^^^^^^^^^^

var findUserById = function(id, callback) {
  console.log("in findUserById in databaseindex.js, passed-in id is ", id);
  return Users.findById(id, callback);
}

var addNewInitialChallenge = function(obj) {
  var newInitialChallenge = new InitialChallenges(obj);
  console.log("The new initialChallenge being saved to the initialChallenges collection in addNewInitialChallenge in database-index is", newInitialChallenge);
  newInitialChallenge.save(function(err) { // now need to change the tail pointer in linkedList, and .next and .previous of last two documents
    InitialChallengesLinkedList.findOne({position: "tail"}, function(err, tail) { // now accessing the current tail
      var tailId = tail.idOfObject;
      console.log("in addNewInitialChallenge, current tail id is ", tailId);
      InitialChallenges.findById(tailId, function(err, challenge) { // finding the tail in the InitialChallenges collection by id
        console.log("The id about to be added to the current tail.next is ", newInitialChallenge._id);
        var prevChallengeId = challenge._id;
        challenge.next = newInitialChallenge._id; // setting the .next on the current tail to the new challenge
        challenge.save(function(err) { // now need to set the previous on the newInitialChallenge
          InitialChallenges.findById(newInitialChallenge._id, function(err, challenge) { // accessing current newest challenge
            challenge.previous = tailId; // setting previous to previous tail
            challenge.save(function(err) { // now need to change tail in linked list
              InitialChallengesLinkedList.findOne({position: "tail"}, function(err, tail) { // accessing current tail in linked list
                tail.idOfObject = newInitialChallenge._id;
                tail.save();
              })
            })
          })
        })
      })
    })
  })
}

var addNewCourseChallenge = function(obj) {
  var newCourseChallenge = new CourseChallenges(obj);
  console.log("The new initialChallenge being saved to the CourseChallenges collection in addnewCourseChallenge in database-index is", newCourseChallenge);
  newCourseChallenge.save(function(err) { // now need to change the tail pointer in linkedList, and .next and .previous of last two documents
    CourseChallengesLinkedList.findOne({position: "tail"}, function(err, tail) { // now accessing the current tail
      var tailId = tail.idOfObject;
      console.log("in addnewCourseChallenge, current tail id is ", tailId);
      CourseChallenges.findById(tailId, function(err, challenge) { // finding the tail in the CourseChallenges collection by id
        console.log("The id about to be added to the current tail.next is ", newCourseChallenge._id);
        var prevChallengeId = challenge._id;
        challenge.next = newCourseChallenge._id; // setting the .next on the current tail to the new challenge
        challenge.save(function(err) { // now need to set the previous on the newCourseChallenge
          CourseChallenges.findById(newCourseChallenge._id, function(err, challenge) { // accessing current newest challenge
            challenge.previous = tailId; // setting previous to previous tail
            challenge.save(function(err) { // now need to change tail in linked list
              CourseChallengesLinkedList.findOne({position: "tail"}, function(err, tail) { // accessing current tail in linked list
                tail.idOfObject = newCourseChallenge._id;
                tail.save();
              })
            })
          })
        })
      })
    })
  })
}

//needs refactor for proper collections
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

var selectAllInitialChallenges = function() {
  console.log("in selectAllInitialChallenges in databaseindex");
  return InitialChallenges.find();
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

//needs refactor for proper challenges collection
var getPopulatedChallenge = function(challengeName) { // changes object ids into actual objects from other collection
  return new Promise(function(resolve, reject) {
    return Challenges.find({challengeName: challengeName}).populate("submittedSolutions").exec(function(err, data) {
      if (err) {return err}
        console.log("data.submittedSolutions in getPopulatedChallenge in database-index is ", data[0].submittedSolutions);
        resolve(data[0].submittedSolutions);
    })

  })
}

//needs refactor for proper linked list collection
var getHeadOfLinkedList = function() {
  return new Promise(function(resolve, reject) {
    console.log("in getHeadOfLinkedList in database-index");
    return LinkedList.findOne({position: "head"}, function(err, document) {
      return InitialChallenges.findById(document.idOfObject, function(err, document) {
        resolve(document);
      });
    });
  })
}

//needs refactor for proper linked list collection
var getTailOfLinkedList = function() {
  return new Promise(function(resolve, reject) {
    console.log("in getTailOfLinkedList in database-index");
    return LinkedList.findOne({position: "tail"}, function(err, document) {
      return InitialChallenges.findById(document.idOfObject, function(err, document) {
        resolve(document);
      });
    });
  })
}

var addUserChallenge = function(obj) {
  console.log("in addUserChallenge in database-index, obj is ", obj);
  var newUserChallenge = new UserChallenges(obj);
  return newUserChallenge.save();
}

var getUserChallengeByName = function(name) {
  return UserChallenges.findOne({challengeName: name});
}

var getAllCourseChallenges = function() {
  console.log("In getAllCourseChallenges in database-index");
  return CourseChallenges.find();
}

var updateUserLevel = function(username, newLevel) {
  console.log("In updateUserLevel in database-index, username is ", username, "and newLevel is ", newLevel);
  return Users.findOneAndUpdate({username: username}, {level: newLevel, completedInitial: true}, {new: true})
}

var updateCompletedCourseChallenges = function(currentUser, message, challengeName) {

  let msg = message === "Success" ? true : false;
  let obj = {};
  finalObj = currentUser.completedCourseChallenges;
  finalObj[challengeName] = msg;
  return Users.findOneAndUpdate({username: currentUser.username}, {completedCourseChallenges: finalObj}, {new: true, upsert: true});
}

// module.exports for each function
module.exports.findUserById = findUserById;
module.exports.addSolution = addSolution;
module.exports.getPopulatedUser = getPopulatedUser;
module.exports.getPopulatedChallenge = getPopulatedChallenge;
module.exports.Users = Users;
module.exports.InitialChallenges = InitialChallenges;
module.exports.selectAllInitialChallenges = selectAllInitialChallenges;
module.exports.addNewInitialChallenge = addNewInitialChallenge;
module.exports.getHeadOfLinkedList = getHeadOfLinkedList;
module.exports.getTailOfLinkedList = getTailOfLinkedList;
module.exports.addUserChallenge = addUserChallenge;
module.exports.getUserChallengeByName = getUserChallengeByName;
module.exports.getAllCourseChallenges = getAllCourseChallenges;
module.exports.updateUserLevel = updateUserLevel;
module.exports.updateCompletedCourseChallenges = updateCompletedCourseChallenges;
module.exports.db = db;












