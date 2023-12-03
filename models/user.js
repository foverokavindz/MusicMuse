// const Joi = require('joi');
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
//const config = require('config');
//const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  preferredGenres: {
    type: [String], // Assuming an array of strings for genres
    default: [],
  },

  playedSongsAndCount: [
    {
      spotifySongId: {
        type: String,
        required: true,
        default: '',
      },
      count: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],

  playedSongsHistory: [
    {
      spotifySongId: {
        type: String,
        required: true,
        default: '',
      },
    },
  ],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

// generate JWT
// userSchema.methods.genAuthenticationTkn = function () {
//   // Generate token  jwtSign+payload+Signature
//   const token = jwt.sign(
//     { _id: this._id, role: this.role },
//     config.get('jwtPrivateKey')
//   );
//   return token;
// };

// Compare password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Create user Model with schema
const User = mongoose.model('User', userSchema);

// validate inputs
// function validateUser(user) {
//   const schema = Joi.object({
//     firstName: Joi.string().min(2).max(50).required(),
//     lastName: Joi.string().min(2).max(50).required(),
//     phone: Joi.string().min(2).max(20).required(),
//     address: Joi.string().min(2).max(50).required(),
//     email: Joi.string().min(5).max(255).required(),
//     password: Joi.string().min(8).max(100).required(),
//     role: Joi.string()
//       .valid(...userSchema.path('role').enumValues)
//       .required(),
//   });

//   return schema.validate(user);
// }

exports.User = User;
//exports.validate = validateUser;
