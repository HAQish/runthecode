const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // adds pre-save validation for unique fields within a Mongoose schema.
const passportLocalMongoose = require('passport-local-mongoose'); // simplifies building username and password login with Passport.
const bcrypt = require('bcrypt');
// handles password hashing in the database
const saltRounds = 5;
const Schema = mongoose.Schema;
const uristring = process.env.TESTMONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/levelup';

mongoose.connect(uristring, (err) => { // creating connection to mongod
  if (err) {
    console.log('mongodb not connected', err);
  } else {
    console.log('connected to database');
  }
});

const db = mongoose.connection;

db.on('error', (err) => { // error message on mongod connection
  console.log('mongoose connection error', err);
});

db.once('open', () => { // success message on mongod connection
  console.log('mongoose connected successfully');
});

// VVVVVVVVVVV Initial Challenges VVVVVVVVVVVVVVV

const initialChallengeSchema = new Schema({
  prompt: String,
  starterCode: String,
  masterTests: String,
  masterTestDescriptions: String,
  challengeNumber: Number,
  challengeName: {
    type: String,
    unique: true
  },
  next: String,
  previous: String
});

const InitialChallenges = mongoose.model('InitialChallenges', initialChallengeSchema, 'initialChallenges');

// ^^^^^^^^^^^ Initial Challenges ^^^^^^^^^^^^^^

// VVVVVVVVVVVVV Course Challenges VVVVVVVVVVVVVVVVVVV

const courseChallengeSchema = new Schema({
  prompt: String,
  starterCode: String,
  masterTests: String,
  masterTestDescriptions: String,
  challengeLevel: Number,
  challengeNumber: Number,
  challengeName: {
    type: String,
    unique: true
  },
  next: String,
  previous: String
});

const CourseChallenges = mongoose.model('CourseChallenges', courseChallengeSchema, 'courseChallenges');

// ^^^^^^^^^^^^^ Course Challenges ^^^^^^^^^^^^^^^^^^^

// VVVVVVVVVVVV User-submitted Challenges VVVVVVVVVVVVV

const userChallengeSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  starterCode: String,
  challengeName: String,
  challengeNumber: Number,
  createdBy: String,
  categories: Array,
  prompt: String,
  masterTests: String,
  testDescriptions: String,
  resources: [{
    resourceName: String,
    resourceUrl: String,
  }],
  hints: [{
    text: String,
    deductionValue: String, // changed to string from number for now
  }],
  masterSolution: String,
  submittedSolutions: [{
    type: Schema.Types.ObjectId,
    ref: 'Solutions'
  }],
  maxScore: String, // changed to string from number for now
  challengeLevel: String // changed to string from number for now
  // next: String, // removing linked list capabilities from user-submitted challenges for now
  // previous: String // removing linked list capabilities from user-submitted challenges for now
});

const UserChallenges = mongoose.model('UserChallenges', userChallengeSchema, 'userChallenges');

// ^^^^^^^^^^^^ User-submitted Challenges ^^^^^^^^^^^^^

// VVVVVVVVVVVVVVV Users VVVVVVVVVVVVVVVVVVVV

const userSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    unique: true
  },
  local: {
    email: {
      type: String,
      unique: true
    },
    password: String,
  },
  completedInitial: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 0
  }, // changed to string from number for now
  experience: String, // changed to string from number for now
  score: String, // changed to string from number for now
  completedCourseChallenges: {
    type: Schema.Types.Mixed,
    default: {
      firstChallenge: true
    }
  },
  completedChallenges: [{
    type: Schema.Types.ObjectId,
    ref: 'Solutions'
  }],
  messages: [{
    message: String,
    meantFor: String,
    from: String,
    to: String
  }],
});

const Users = mongoose.model('Users', userSchema);

// ^^^^^^ Users ^^^^^^^

// VVVVVVVV Solutions VVVVVVVVV

const solutionsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  challengeName: String,
  prompt: String,
  createdBy: String,
  solvedBy: String,
  score: String, // changed to string from number for now
  rating: {
    type: Schema.Types.Mixed,
    default: {
      kevin: 1
    }
  }, // changed to string from number for now
  masterUserSolutionCode: String,
  difficulty: String,
  comments: [{
    user: String,
    comment: String
  }]
});

const Solutions = mongoose.model('Solutions', solutionsSchema);

// ^^^^^^^^ Solutions ^^^^^^^^^

//  VVVVVVVVVVVVV Linked List VVVVVVVVVVV

const initialChallengesLinkedListSchema = new Schema({
  position: {
    type: String,
    unique: true
  }, // head or tail
  idOfObject: String
});

const InitialChallengesLinkedList = mongoose.model('InitialChallengesLinkedList', initialChallengesLinkedListSchema, 'initialChallengesLinkedList');

const courseChallengesLinkedListSchema = new Schema({
  position: {
    type: String,
    unique: true
  }, // head or tail
  idOfObject: String
});

const CourseChallengesLinkedList = mongoose.model('CourseChallengesLinkedList', courseChallengesLinkedListSchema, 'courseChallengesLinkedList');

// ^^^^^^^^^^^^^^ Linked List ^^^^^^^^^^^^^^

// VVVVVVVVVVVVV Database functions VVVVVVVVVVVVV

/*          Adding new challenges           */

const addNewInitialChallenge = function (obj) {
  const newInitialChallenge = new InitialChallenges(obj);
  console.log('The new initialChallenge being saved to the initialChallenges collection in addNewInitialChallenge in database-index is', newInitialChallenge);
  newInitialChallenge.save((err) => { // now need to change the tail pointer in linkedList, and .next and .previous of last two documents
    InitialChallengesLinkedList.findOne({
      position: 'tail'
    }, (err, tail) => { // now accessing the current tail
      const tailId = tail.idOfObject;
      console.log('in addNewInitialChallenge, current tail id is ', tailId);
      InitialChallenges.findById(tailId, (err, challenge) => { // finding the tail in the InitialChallenges collection by id
        console.log('The id about to be added to the current tail.next is ', newInitialChallenge._id);
        const prevChallengeId = challenge._id;
        challenge.next = newInitialChallenge._id; // setting the .next on the current tail to the new challenge
        challenge.save((err) => { // now need to set the previous on the newInitialChallenge
          InitialChallenges.findById(newInitialChallenge._id, (err, challenge) => { // accessing current newest challenge
            challenge.previous = tailId; // setting previous to previous tail
            challenge.save((err) => { // now need to change tail in linked list
              InitialChallengesLinkedList.findOne({
                position: 'tail'
              }, (err, tail) => { // accessing current tail in linked list
                tail.idOfObject = newInitialChallenge._id;
                tail.save();
              });
            });
          });
        });
      });
    });
  });
};

const addNewCourseChallenge = function (obj) {
  const newCourseChallenge = new CourseChallenges(obj);
  console.log('The new initialChallenge being saved to the CourseChallenges collection in addnewCourseChallenge in database-index is', newCourseChallenge);
  newCourseChallenge.save((err) => { // now need to change the tail pointer in linkedList, and .next and .previous of last two documents
    CourseChallengesLinkedList.findOne({
      position: 'tail'
    }, (err, tail) => { // now accessing the current tail
      const tailId = tail.idOfObject;
      console.log('in addnewCourseChallenge, current tail id is ', tailId);
      CourseChallenges.findById(tailId, (err, challenge) => { // finding the tail in the CourseChallenges collection by id
        console.log('The id about to be added to the current tail.next is ', newCourseChallenge._id);
        const prevChallengeId = challenge._id;
        challenge.next = newCourseChallenge._id; // setting the .next on the current tail to the new challenge
        challenge.save((err) => { // now need to set the previous on the newCourseChallenge
          CourseChallenges.findById(newCourseChallenge._id, (err, challenge) => { // accessing current newest challenge
            challenge.previous = tailId; // setting previous to previous tail
            challenge.save((err) => { // now need to change tail in linked list
              CourseChallengesLinkedList.findOne({
                position: 'tail'
              }, (err, tail) => { // accessing current tail in linked list
                tail.idOfObject = newCourseChallenge._id;
                tail.save();
              });
            });
          });
        });
      });
    });
  });
};

const addUserChallenge = function (obj) {
  console.log('in addUserChallenge in database-index, obj is ', obj);
  const newUserChallenge = new UserChallenges(obj);
  return newUserChallenge.save();
};

/*          Solution functions           */

// needs refactor for proper collections
const addSolution = function (answer, username, challengeName) { // adds to solutions collection and adds id to users and challenges collections
  const newSolution = new Solutions({
    masterUserSolutionCode: answer,
    solvedBy: username,
    challengeName
  });
  newSolution._id = new mongoose.Types.ObjectId();
  console.log('The new solution being saved to the solutions collection in addSolution in database-index is ', newSolution);

  newSolution.save(err => // now, we need to save the ID to the supplied user
    Users.findOne({
      username
    }, (err, user) => {
      if (err) {
        return err;
      }

      user.completedChallenges = user.completedChallenges.concat(newSolution._id);
      console.log('in addSolution in database-index, added newSolution with id ', newSolution._id, 'to user ', user.username);

      user.save((err) => { // now, we need to save the ID to the supplied challenge
        UserChallenges.findOne({
          challengeName
        }, (err, challenge) => {
          if (err) {
            return err;
          }

          challenge.submittedSolutions = challenge.submittedSolutions.concat(newSolution._id);
          console.log('in addSolution in database-index, added newSolution with id ', newSolution._id, 'to challenge ', challenge.challengeName);
          return challenge.save();
        });
      });
    }));
};

const rateSolution = function (challengeName, solver, rater, vote) {
  const rateStr = `rating.${rater}`;
  return Solutions.findOneAndUpdate({
    challengeName,
    solvedBy: solver
  }, {
    $set: {
      [rateStr]: Number(vote)
    }
  }, {
    new: true
  }, );
};

const getPopulatedUser = function (username) { // changes object ids into actual objects from other collection
  return new Promise(((resolve, reject) => Users.find({
    username
  }).populate('completedChallenges').exec((err, data) => {
    if (err) {
      return err;
    }
    console.log('data.completedChallenges in getPopulatedUser in database-index is ', data[0]);
    resolve(data[0]);
  })));
};

const getPopulatedChallenge = function (challengeName) { // changes object ids into actual objects from other collection
  return new Promise(((resolve, reject) => UserChallenges.find({
    challengeName
  }).populate('submittedSolutions').exec((err, data) => {
    if (err) {
      console.log('EEEERRR', err);
      return err;
    }
    console.log('data.submittedSolutions in getPopulatedChallenge in database-index is ', data[0].submittedSolutions);
    resolve(data[0]);
  })));
};

/*          Linked List functions          */

// needs refactor for proper linked list collection
const getHeadOfLinkedList = function () {
  return new Promise(((resolve, reject) => {
    console.log('in getHeadOfLinkedList in database-index');
    return LinkedList.findOne({
      position: 'head'
    }, (err, document) => InitialChallenges.findById(document.idOfObject, (err, document) => {
      resolve(document);
    }));
  }));
};

// needs refactor for proper linked list collection
const getTailOfLinkedList = function () {
  return new Promise(((resolve, reject) => {
    console.log('in getTailOfLinkedList in database-index');
    return LinkedList.findOne({
      position: 'tail'
    }, (err, document) => InitialChallenges.findById(document.idOfObject, (err, document) => {
      resolve(document);
    }));
  }));
};

/*          Retrieving Challenges           */

const selectAllInitialChallenges = function () {
  console.log('in selectAllInitialChallenges in databaseindex');
  return InitialChallenges.find();
};

const getAllCourseChallenges = function () {
  console.log('In getAllCourseChallenges in database-index');
  return CourseChallenges.find();
};

const getAllUserChallenges = function () {
  console.log('In getAllUserChallenges in db-index');
  return UserChallenges.find();
};

const getUserChallengeByName = function (name) {
  return UserChallenges.findOne({
    challengeName: name
  });
};

/*          User Functions           */

const findUserById = function (id, callback) {
  console.log('in findUserById in databaseindex.js, passed-in id is ', id);
  return Users.findById(id, callback);
};

const updateUserLevel = function (username, newLevel) {
  console.log('In updateUserLevel in database-index, username is ', username, 'and newLevel is ', newLevel);
  return Users.findOneAndUpdate({
    username
  }, {
    level: newLevel,
    completedInitial: true
  }, {
    new: true
  });
};

const updateCompletedCourseChallenges = function (currentUser, message, challengeName) {
  const msg = message === 'Success';
  const obj = {};
  finalObj = currentUser.completedCourseChallenges;
  finalObj[challengeName] = msg;
  if (msg) {
    return Users.findOneAndUpdate({
      username: currentUser.username
    }, {
      completedCourseChallenges: finalObj,
      level: currentUser.level + 0.5
    }, {
      new: true,
      upsert: true
    });
  }
  return Users.findOneAndUpdate({
    username: currentUser.username
  }, {
    completedCourseChallenges: finalObj
  }, {
    new: true,
    upsert: true
  });
};

const addMessageToUser = function (username, messageObj) {
  return Users.findOne({
    username
  }, (err, user) => {
    console.log('In addMessageToUser in dbindex, user is', user);
    user.messages = user.messages.concat(messageObj);
    user.save();
  });
};

const retrieveAllMessagesFromUser = function (username) {
  return Users.findOne({
    username
  }).select('messages');
};

const getAllUsers = function () {
  console.log('in getAllUsers in dbindex');
  return Users.find().select('username');
};

// ^^^^^^^^^^^^^^^ Database functions ^^^^^^^^^^^^^^^

/*          Exports           */

// Database
module.exports.db = db;

// Collections
module.exports.Users = Users;
module.exports.InitialChallenges = InitialChallenges;
module.exports.CourseChallenges = CourseChallenges;
module.exports.UserChallenges = UserChallenges;
module.exports.Solutions = Solutions;

// Adding New Challenges
module.exports.addNewInitialChallenge = addNewInitialChallenge;
module.exports.addNewCourseChallenge = addNewCourseChallenge;
module.exports.addUserChallenge = addUserChallenge;

// Solution Functions
module.exports.addSolution = addSolution;
module.exports.rateSolution = rateSolution;
module.exports.getPopulatedUser = getPopulatedUser;
module.exports.getPopulatedChallenge = getPopulatedChallenge;

// Linked List Functions
module.exports.getHeadOfLinkedList = getHeadOfLinkedList;
module.exports.getTailOfLinkedList = getTailOfLinkedList;

// Retrieving Challenges
module.exports.selectAllInitialChallenges = selectAllInitialChallenges;
module.exports.getAllCourseChallenges = getAllCourseChallenges;
module.exports.getAllUserChallenges = getAllUserChallenges;
module.exports.getUserChallengeByName = getUserChallengeByName;

// User Functions
module.exports.findUserById = findUserById;
module.exports.updateUserLevel = updateUserLevel;
module.exports.updateCompletedCourseChallenges = updateCompletedCourseChallenges;
module.exports.addMessageToUser = addMessageToUser;
module.exports.retrieveAllMessagesFromUser = retrieveAllMessagesFromUser;
module.exports.getAllUsers = getAllUsers;