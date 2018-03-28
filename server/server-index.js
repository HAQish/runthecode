const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const Users = require('../database/database-index.js').Users
const db = require('../database/database-index.js');
const passport = require('passport');

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var PORT = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

//socket.io stuff
io.on("connection", function(socket) {
  console.log("Connection made via socket.io on ", socket.id);

  var code;

  socket.on("codeChange", function(newCode) {
    console.log("the new code being sent to the server's socket is ", newCode);
    var code = newCode;
    socket.broadcast.emit("codeChangeFromServer", newCode);
  })

  // setInterval(function() {socket.broadcast.emit("codeChangeFromServer", code)}, 1000);

  socket.on("disconnect", function() {
    console.log("Disconnected from socket.");
  });

})




http.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

const MongoStore = require('connect-mongo')(session); 
app.use(cookieParser());
app.use(session({
  secret: 'abcdefg',
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db.db,
    ttl: 2 * 24 * 60 * 60
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




require('./routes.js').passportRoutes(app, passport);
require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);































