const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
require('../config/passport.js')(passport);

var app = express();
var PORT = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'willsmith',
  saveUninitialized: true,
  resave: true
}));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./../config/passport.js')(passport);

require('./routes.js').passportRoutes(app, passport);
require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);

//creates server, function runs once upon creation
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});