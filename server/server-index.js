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

//arr for socket users
var usersArr = [];

//socket.io functionality
io.on("connection", function(socket) {
  console.log("Connection made via socket.io on", socket.id);
  
  socket.on("onlineUpdate", function(user) {
    console.log("socket on backend heard onlineUpdate, user is", user);
    if (user !== null) {
      for (let i = 0; i < usersArr.length; i++) {
        if (usersArr[i][0] === user || usersArr[i][1] === socket.id) {
          usersArr.splice(i, 1);
        }
      }
      usersArr.push([user, socket.id]);
    }
    console.log("socket on backend heard onlineUpdate, current users are", usersArr);

  })

  socket.on("getOnlineUsers", function() {
    // console.log("socket on backend heard getOnlineUsers");
    socket.emit("returnOnlineUsers", usersArr);
  })

  socket.on("joinRoom", function(roomName) {
    console.log("Joining a room in the socket", roomName);
    socket.join(roomName);
  })

  socket.on("leaveRoom", function(roomName) {
    console.log("Leaving a room in the socket", roomName);
    socket.leave(roomName);
  })

  socket.on("codeChange", function(newCodeObj) {
    console.log("the new code being sent to the server's socket is ", newCodeObj);
    socket.to(newCodeObj.roomName).emit("codeChangeFromServer", newCodeObj.code);
  })

  socket.on("componentWillMountPairing", function(socketObj) {
    socket.to(socketObj.roomName).emit("socketIdFromPartner", socketObj.id);
  })

  socket.on("sendChatFromApp", function(chatMsg) {
    io.in(chatMsg.roomName).emit("sendChatFromServer", chatMsg);
  })

  socket.on("sendChatMessage", function(messageObj) {
    console.log("Back end socket heard sent chat message", messageObj);
    //to is user receiving message
    db.addMessageToUser(messageObj.to, messageObj)
      .then(results => db.retrieveAllMessagesFromUser(messageObj.to))
      .then(results => socket.to(messageObj.meantFor).emit("sendChatMessage", results));
  })

  socket.on("receiveAllChatMessages", function(username) {
    // console.log("backend heard request for all chat messages for user", username);
    db.retrieveAllMessagesFromUser(username)
      .then(messages => socket.emit("receiveAllChatMessages", messages));
  })

  socket.on("Logout socket", function(username) {
    for (let i = 0; i < usersArr.length; i++) {
      if (usersArr[i][0] === username) {
        usersArr.splice(i, 1);
      }
    }
  })

  socket.on("disconnect", function() {
    for (let i = 0; i < usersArr.length; i++) {
      if (usersArr[i][1] === socket.id) {
        usersArr.splice(i, 1);
      }
    }
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

module.exports = app;