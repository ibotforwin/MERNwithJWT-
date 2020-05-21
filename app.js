//This is our entry file. Here we import all the packages, assign them to a const, and connect to our database.

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
app.use(cookieParser());
app.use(express.json());

//Deployment - Traversy
const path = require('path');

mongoose.connect(
  'mongodb+srv://user123:user123@cluster0-pw65x.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to mongoose database');
  }
);

//Requiring the User router.
//Telling out express "app" to use the router.
//The router configuration is in the require directory.
const userRouter = require('./routes/User');
app.use('/user', userRouter);

//Serve static assets in production (AFTER ROUTES)
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// THIS IS A TEST
// THIS IS A TEST
// THIS IS A TEST

//This pulls in the model we created.
// const User = require('./models/User');

// //We are just creating filler data for the object.
// const userInput = {
//   username: 'noobcoder1234',
//   password: '1234567',
//   role: 'admin',
// };

// //Passing the user data created above to create a new User object.
// const user = new User(userInput);
// user.save((err, document) => {
//   if (err) console.log(err);
//   console.log(document);
// });

// THIS IS A TEST
// THIS IS A TEST
// THIS IS A TEST

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Express Server Started');
});
