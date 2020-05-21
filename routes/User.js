//For this, we installed jsonwebtoken. It will be used to "sign" a jwttoken. So token creation.

const express = require('express');
const userRouter = express.Router();
//We configured the passport before in passport.js, here we will actually use it.
const passport = require('passport');
const passportConfig = require('../passport');

//This will be used to create a jsonwebtoken.
const JWT = require('jsonwebtoken');

const User = require('../models/User');
const Todo = require('../models/Todo');

const signToken = (userID) => {
  console.log('---');
  return JWT.sign(
    {
      iss: 'NoobCoder',
      sub: userID,
    },
    //This is the secretOrKey we chose.
    'NoobCoder',
    { expiresIn: '1h' }
  );
};

//Creating our first route.

// Access:      Public
// Endpoint:    user/register/
// Description: Registration route

//The (req,res) is out callback.
//We then destructure the req.body to get the username, password and role.
userRouter.post('/register/', (req, res) => {
  console.log('beginning reg route');
  const { username, email, password, role } = req.body;

  console.log(email);

  //Check to see if username exists.
  //The call back here is (err,user). Return err if not found and user object if found.
  User.findOne({ username }, (err, user) => {
    if (err) {
      console.log('in route');
      res
        .status(500)
        .json({ message: { msgBody: 'Error has occured', msgError: true } });
    }
    if (user) {
      console.log('space');
      res.status(400).json({
        message: { msgBody: 'Username/Email is already taken', msgError: true },
      });
    } else {
      //Let's check to make sure duplicate email doesn't exist.

      User.findOne({ email }, (err, user) => {
        if (err) {
          console.log('in route');
          res
            .status(500)
            .json({
              message: { msgBody: 'Error has occured', msgError: true },
            });
        }
        if (user) {
          console.log('space');
          res.status(400).json({
            message: {
              msgBody: 'Username/Email is already taken',
              msgError: true,
            },
          });
        } else {
          //Since 1. No error 2. User does not already exist 3. Email does not already exist
          //We can now create the user.
          const newUser = new User({ username, email, password, role });
          newUser.save((err) => {
            if (err) {
              console.log('space');
              res.status(500).json({
                message: { msgBody: 'Error has occured', msgError: true },
              });
            }
            //Now we set msgError to false since everything went well.
            else {
              res.status(201).json({
                message: {
                  msgBody: 'Account successfully created',
                  msgError: false,
                },
              });
            }
          });
        }
      });
    }
  }); //First UserFind ends
});

// Access:      Public
// Endpoint:    user/login/
// Description: Login route

// We are passing the passport middleware here for authentication. The 'local' is our strategy argument.
// It is the 'new LocalStrategy' created in the passport.js file
userRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    console.log('INPUT JSON DATA');
    console.log(req.body);
    //If user IS authenticated
    if (req.isAuthenticated()) {
      //Where does "req.user" come from? -> It is coming from passpot.js LocalStrategy, which in turn is pulling it from the user.comparePassword(password,done)
      //That comparePassword runs in User.js, function called UserSchema.methods.comparePassword, which returns cb(error, callback_argument), that callback
      //argument that is passed in the case that the comparePassword is successful is "cb(null,this)"-> null error because no error, and the "this" refers to the user /
      //object
      console.log('inside is');
      const { _id, username, email, role } = req.user;
      console.log(req.user);
      console.log(email);

      const token = signToken(_id);
      //httpOnly makes it so you can't touch it from the client side. sameSite prevents cross-site forgery attacks. These are both security features.
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { username, email, role } });
    } else {
      console.log('failed');
    }
  }
);

// Access:      Private
// Endpoint:    user/logout/
// Description: Logout route

userRouter.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: '', email: '', role: '' }, success: true });
  }
);

// Access:      Private
// Endpoint:    user/todo/
// Description: Todo list route

userRouter.post(
  '/todo',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const todo = new Todo(req.body);
    todo.save((err) => {
      if (err) {
        res
          .status(500)
          .json({ message: { msgBody: 'Error has occured', msgError: true } });
      } else {
        //req.user is added by passport. Passport attached the user object to the request object.
        //We are adding the todo to the list of todos
        req.user.todos.push(todo);
        req.user.save((err) => {
          if (err) {
            res.status(500).json({
              message: { msgBody: 'Error has occured', msgError: true },
            });
          } else {
            res.status(200).json({
              message: { msgBody: 'Successfully created', msgError: false },
            });
          }
        });
      }
    });
  }
);

// Access:      Private
// Endpoint:    user/todos/
// Description: Todo list route

userRouter.get(
  '/todos',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('Inside TODO ROUTE');

    //Populate => Populate the todos array.
    User.findById({ _id: req.user.id })
      .populate('todos')
      .exec((err, document) => {
        if (err) {
          res.status(500).json({
            message: { msgBody: 'Error has occured', msgError: true },
          });
        } else {
          console.log(document.todos);
          res.status(200).json({
            todos: document.todos,
            authenticated: true,
          });
        }
      });
  }
);

// Access:      Private
// Endpoint:    user/admin/
// Description: Login only for admin

userRouter.get(
  '/admin',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.role == 'admin') {
      res
        .status(200)
        .json({ message: { msgBody: 'You are admin', msgError: true } });
    } else {
      res
        .status(403)
        .json({ message: { msgBody: 'You are not an admin', msgError: true } });
    }
  }
);

// Access:      Private
// Endpoint:    user/admin/
// Description: Login only for admin

//This is authentication route to ensure that the client and server are in sync regarding authorization state.
//So, even if the users closes and re-opens browser they should remain logged in.
//It will be used for "persistance" with our front end.

userRouter.get(
  '/authenticated',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { username, role } = req.user;
    console.log('message3 - authenticated route');

    //It appears as if we are updating the state of the authentication json to let the browser (frontend/react) know whether the user is authenticated in the backend or not.
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  }
);

module.exports = userRouter;
