//This whole file is passport cofiguration, to be used in User.js in routes directory.

//Authentication middleware
const passport = require('passport');
//This is how we actually authenticate
const LocalStrategy = require('passport-local').Strategy;
// This is required for using JWT authentication on the passport
const JwtStrategy = require('passport-jwt').Strategy;
//Importing User model
const User = require('./models/User');

//Something to notice. We always do x.use(new ...), this is because we are instantiating an instance of the class of JwtStrategy for out purposes.
//I believe that is what is happening here.

//This cookieExtractor is used in passport.use. This is the function that pulls it.

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }

  return token;
};

//The passport-jwt instance used here will load cookieExtarctor function, and get the token.
//This is used for authorization, whenever we want to protect endpoints
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: 'NoobCoder',
    },

    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

// This middleware is used for authentication using email and password, only used for login
passport.use(
  //The "done" parameter will be used in the function comparePassword. The comparePassword function was created in User.js,
  //it is the function that checks if the entered password matches the one in the database for user verification.
  new LocalStrategy(
    // { usernameField: 'email' }  -> Instead of using this we accept both username or email
    (username_or_email, password, done) => {
      //The (err,user) portion is called the "callback", it is what mongoose returns to us.

      //If username_or_email as EMAIL exists
      User.findOne({ email: username_or_email }, (err, user) => {
        //If there is an error
        if (err) {
          return done(err);
        }
        //If there is no user
        if (!user) {
          // return done(null, false);
          //If username_or_email as USERNAME exists
          User.findOne({ username: username_or_email }, (err, user) => {
            //If there is an error
            if (err) {
              return done(err);
            }
            //If there is no user
            if (!user) {
              return done(null, false);
            } else {
              // Check if password is correct, described more above
              user.comparePassword(password, done);
            }
          });
        } else {
          // Check if password is correct, described more above
          user.comparePassword(password, done);
        }
      });
    }
  )
);
