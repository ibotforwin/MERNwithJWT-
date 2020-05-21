const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 1,
    max: 100,
  },
  username: {
    type: String,
    required: true,
    min: 1,
    max: 100,
  },
  password: {
    type: String,
    required: true,
    min: 1,
    max: 100,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },

  //This is a many to one relationship with a reference to Todos Schema/Model
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
});

//Prehook, it executes right before save of UserSchema, so it is middleware at the database level
//We are checking to see if password field is already hashed.
//This will be used in 2 situations. 1: New user. 2: Password change.

//We use "function" instead of the arrow function because we want access to "this"
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

//We use "function" instead of the arrow function because we want access to "this"
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      //The "this" argument here becomes the user object
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model('User', UserSchema);
