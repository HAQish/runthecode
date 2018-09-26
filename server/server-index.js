const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const Users = require('../database/database-index.js').Users;
const db = require('../database/database-index.js');
const passport = require('passport');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, '../client/dist')));

// arr for socket users
const usersArr = [];

const roomsObj = {};

// {roomName: [[user1, driver], [user2, nav], [user3, nav] ] }

// socket.io functionality
io.on('connection', (socket) => {
  console.log('Connection made via socket.io on', socket.id);

  socket.on('onlineUpdate', (user) => {
    console.log('socket on backend heard onlineUpdate, user is', user);
    if (user !== null) {
      for (let i = 0; i < usersArr.length; i++) {
        if (usersArr[i][0] === user || usersArr[i][1] === socket.id) {
          usersArr.splice(i, 1);
        }
      }
      usersArr.push([user, socket.id]);
    }
    console.log('socket on backend heard onlineUpdate, current users are', usersArr);
  });

  socket.on('getOnlineUsers', () => {
    // console.log("socket on backend heard getOnlineUsers");
    socket.emit('returnOnlineUsers', usersArr);
  });

  socket.on('getAllUsers', () => {
    console.log('socket heard getAllUsers');
    db.getAllUsers().then(users => socket.emit('getAllUsers', users));
  });

  socket.on('newDriver', (usernameObj) => {
    console.log('socket heard a new driver', usernameObj.username);
    io.in(usernameObj.roomName).emit('newDriver', usernameObj.username);
  });

  socket.on('joinRoom', (obj) => {
    console.log('Joining a room in the socket', obj.roomName);
    if (roomsObj.hasOwnProperty(obj.roomName)) {
      roomsObj[obj.roomName].push([obj.username, obj.role]);
    } else {
      roomsObj[obj.roomName] = [
        [obj.username, obj.role]
      ];
    }
    socket.join(obj.roomName);
  });

  socket.on('getUsersInSession', (roomName) => {
    console.log('roomsObj', roomsObj[roomName]);
    socket.emit('getUsersInSession', roomsObj[roomName]);
  });

  socket.on('roleChange', (obj) => {
    console.log('Backend heard rolechange', obj);
    console.log('in roleChange roomsObj[roomName] is', roomsObj[obj.roomName]);
    for (let i = 0; i < roomsObj[obj.roomName].length; i++) {
      if (roomsObj[obj.roomName][i][0] === obj.user) {
        console.log('in roleCHange, if branch activted');
        roomsObj[obj.roomName][i][1] === 'Driver' ? roomsObj[obj.roomName][i][1] = 'Navigator' : roomsObj[obj.roomName][i][1] = 'Driver';
      }
    }
  });

  socket.on('leaveRoom', (obj) => {
    console.log('Leaving a room in the socket', obj.roomName);

    if (roomsObj.hasOwnProperty(obj.roomName)) {
      for (let i = 0; i < roomsObj[obj.roomName].length; i++) {
        if (roomsObj[obj.roomName][i][0] === obj.username) {
          roomsObj[obj.roomName].splice(i, 1);
        }
      }
    }

    if (roomsObj[obj.roomName].length === 0) {
      delete roomsObj[obj.roomName];
    }
    socket.leave(obj.roomName);
  });

  socket.on('codeChange', (newCodeObj) => {
    console.log("the new code being sent to the server's socket is ", newCodeObj);
    socket.to(newCodeObj.roomName).emit('codeChangeFromServer', newCodeObj.code);
  });

  socket.on('componentWillMountPairing', (socketObj) => {
    socket.to(socketObj.roomName).emit('socketIdFromPartner', socketObj.id);
  });

  socket.on('sendChatFromApp', (chatMsg) => {
    io.in(chatMsg.roomName).emit('sendChatFromServer', chatMsg);
  });

  socket.on('sendChatMessage', (messageObj) => {
    console.log('Back end socket heard sent chat message', messageObj);
    // to is user receiving message
    db.addMessageToUser(messageObj.to, messageObj)
      .then(results => db.retrieveAllMessagesFromUser(messageObj.to))
      .then(results => socket.to(messageObj.meantFor).emit('sendChatMessage', results));
  });

  socket.on('receiveAllChatMessages', (username) => {
    // console.log("backend heard request for all chat messages for user", username);
    db.retrieveAllMessagesFromUser(username)
      .then(messages => socket.emit('receiveAllChatMessages', messages));
  });

  socket.on('Logout socket', (username) => {
    for (let i = 0; i < usersArr.length; i++) {
      if (usersArr[i][0] === username) {
        usersArr.splice(i, 1);
      }
    }
  });

  socket.on('disconnect', () => {
    for (let i = 0; i < usersArr.length; i++) {
      if (usersArr[i][1] === socket.id) {
        usersArr.splice(i, 1);
      }
    }
    console.log('Disconnected from socket.');
  });
});


http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const MongoStore = require('connect-mongo')(session);

app.use(cookieParser());
app.use(session({
  secret: 'abcdefg',
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db.db,
    ttl: 2 * 24 * 60 * 60,
  }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes.js').passportRoutes(app, passport);
require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);

module.exports = app;