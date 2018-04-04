const LocalStrategy = require('passport-local').Strategy;

const Users = require('../database/database-index.js').Users;

module.exports = (passport) => {
  console.log('hit this thing');
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    Users.findById(id, (err, user) => {
      cb(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy(
    {
      username: 'username',
      password: 'password',
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      console.log('HIT ME, in local-signup passport strategy');
      process.nextTick(() => {
        Users.findOne({ 'local.email': username }, (err, user) => {
          if (err) return cb(err);
          if (user) return cb(null, false, req.flash('signupMessage', 'Email already taken'));

          const newUser = new Users();
          newUser.local.email = username;
          newUser.local.password = password;
          newUser.username = req.body.nickname;
          newUser.save((err) => {
            if (err) console.log('hit err in newuser save', err);
            console.log(newUser);
            return cb(null, newUser, req.flash('User', newUser));
          });
        });
      });
    },
  ));

  passport.use('local-login', new LocalStrategy(
    {
      username: 'username',
      password: 'password',
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      console.log('HIT YOURSELF, in local-login passport strategy');
      process.nextTick(() => {
        Users.findOne({ 'local.email': username }, (err, user) => {
          if (err) return cb(err);
          if (!user) return cb(null, false, req.flash('loginMessage', 'User not found'));
          if (user.local.password !== password) return cb(null, false, req.flash('loginMessage', 'Incorrect Password'));
          return cb(null, user, req.flash('User', user));
        });
      });
    },
  ));
};
