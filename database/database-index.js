const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //adds pre-save validation for unique fields within a Mongoose schema.
const passportLocalMongoose = require('passport-local-mongoose'); //simplifies building username and password login with Passport.
const bcrypt = require('bcrypt'); // handles password hashing in the database
const saltRounds = 5;
let Schema = mongoose.Schema;
let uristring = process.env.MONGODB_URI || 'mongodb://localhost:27017/levelup';
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('mongoose connection error', err);
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});


var userSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  key: value,
  local: {
    username: String,
    password: String
  },
  email: String,
  level: Number,
  experience: Number,
  score: Number,
  completedChallenges: [{
    challengeName: String,
    solution: {
      text: String,
      rating: Number,
      score: Number
    }
  }]
})

var Users = mongoose.model("Users", userSchema);

var challengeSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  key: value,
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
    deductionValue: Number
  }],
  masterSolution: String,
  submittedSolutions: [{
    createdAt: {type: Date, default: Date.now},
    createdBy: String,
    score: Number,
    rating: Number
  }],
  maxScore: Number,
  difficulty: Number
})

var Challenges = mongoose.model("Challenges", challengeSchema);

// module.exports for each function