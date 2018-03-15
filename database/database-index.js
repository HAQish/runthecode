const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //adds pre-save validation for unique fields within a Mongoose schema.
const passportLocalMongoose = require('passport-local-mongoose'); //simplifies building username and password login with Passport.
const bcrypt = require('bcrypt'); // handles password hashing in the database
const saltRounds = 5;
let Schema = mongoose.Schema;
let uristring = process.env.MONGODB_URI || 'mongodb://localhost:27017/thesis';
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('mongoose connection error', err);
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});


var userSchema = new Schema({
  key: value
})

var Users = mongoose.model("Users", userSchema);

var questionSchema = new Schema({
  key: value
})

var Questions = mongoose.model("Questions", questionSchema);

// module.exports for each function