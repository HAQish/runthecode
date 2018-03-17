// const express = require('express');
// const path = require('path');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const db = require('./../database/database-index');

// let app = express();

// let PORT = process.env.PORT || 3030;

// // Authentication Packages
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// // Parses JSON, urls and cookies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Serves static files to client
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Express Session
// app.use(session({
//   secret: 'This is our secret',
//   resave: true,
//   saveUninitialized: true,
//   store: new MongoStore({
//     mongooseConnection: db.connection,
//     ttl: 2 * 24 * 60 * 60
//   })
// }));

// // Passport init
// app.use(passport.initialize());
// app.use(passport.session());









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
// app.use(flash());




require('./routes.js').passportRoutes(app, passport);
require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);































