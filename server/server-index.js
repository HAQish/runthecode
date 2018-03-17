const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const Users = require('../database/database-index.js').Users
const db = require('../database/database-index.js');

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
  resave: true
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('../config/passport.js')(passport);

  //Sign up routes
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signupSuccess',
    failureRedirect: '/signupFailure',
    failureFlash: true,
    successFlash: true
  }));
  app.get('/signupSuccess', function(req, res) {
    console.log('hit signup success');
    res.send(req.flash('User'));
  });
  app.get('/signupFailure', function(req, res) {
    console.log('hit signup fail');
    res.send({message: req.flash('signupMessage')});
  });

  //Login routes
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure',
    failureFlash: true,
    successFlash: true
  }));
  app.get('/loginSuccess', function(req, res) {
    res.send(req.flash('User'));
  });
  app.get('/loginFailure', function(req, res) {
    res.send({message: req.flash('loginMessage')});
  });

  //Logout route
  app.get('/logout', function(req, res) {
    console.log('in logout -- ', req.user);
    req.logout();
    res.end('Logged out successfully');
  });

require('./routes.js').challengeRoutes(app);
require('./routes.js').dbRoutes(app);

//creates server, function runs once upon creation
