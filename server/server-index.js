const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var db = require("./../database/database-index.js");


let app = express();

let PORT = process.env.PORT || 3030;

// Parses JSON, urls and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serves static files to client
app.use(express.static(path.join(__dirname, '../client/dist')));

app.post("/code", function(req, res) {
  res.send("Heard post from app.")
  console.log("The current state of the code is ", req.body.code);
})

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

//creates server, function runs once upon creation
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});


//jasmine, mocha
//travisCI
//