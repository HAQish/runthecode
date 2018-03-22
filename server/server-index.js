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
var PORT = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

app.use(cookieParser());
app.use(session({
  secret: 'abcdefg',
  saveUninitialized: true,
  // store: new MongoStore({
  //   mongooseConnection: db.db,
  //   ttl: 2 * 24 * 60 * 60
  // })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




require('./routes.js').passportRoutes(app, passport);
require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);































