/*
const asyncHandler = require('express-async-handler');
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Login the user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send('Please Enter Email And Password');

  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(400).send('Invalid Email or Password');

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return res.status(400).send('Invalid Email or Password');

  const token = user.genAuthenticationTkn();

  // BUG NOTE  - Log weddi okkoma details send wenawa
  res.header('x-auth-token', token).send(user);
});

// Logout the user (remove token)
// NOTE
const logout = asyncHandler(async (req, res) => {
  // res.cookie('token', null, {
  //   expires: new Date(Date.now()),
  //   httpOnly: true,
  // });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

// update User Profile
const userUpdateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const { firstName, lastName, email, phone, address } = req.body;

  if (user) {
    user.firstName = firstName || user.firstName.trim();
    user.lastName = lastName || user.lastName.trim();
    user.email = email || user.email.trim();
    user.phone = phone || user.phone.trim();
    user.address = address || user.address.trim();
    // user.role = role; - not allowed to change roll. Admin only

    const updatedUser = await user.save();

    res.send(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Delete User
const userDelete = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(204).json({ message: 'User deleted successfully' });
});

// Get user Profile
const userProfileGet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Add new User
const userRegister = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('Email already exists');

  const { firstName, lastName, phone, address, city, email, role } = req.body;

  let { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  user = await User.create({
    firstName,
    lastName,
    phone,
    address,
    city,
    email,
    password,
    role,
  });

  const token = user.genAuthenticationTkn();

  res
    .header('x-auth-token', token)
    .send(
      _.pick(user, [
        'firstName',
        'lastName',
        'phone',
        'address',
        'city',
        'email',
        'role',
      ])
    );
});

// Get all Users
const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Chnage user system role - Customer - Admin - Operator
//NOTE
const userRoleUpdate = asyncHandler(async (req, res) => {});

// export all Controllers
module.exports = {
  login,
  logout,
  userUpdateProfile,
  userDelete,
  userProfileGet,
  userRegister,
  allUsers,
  getUserById,
  userRoleUpdate,
};
*/

const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { User } = require('../models/user');

// Login the user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // // Validate request body
  // const { error } = validate({ email, password });
  // if (error)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: error.details[0].message });

  // Check if the user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password.' });

  // Compare passwords
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email or password.' });

  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  res.json({ success: true, message: 'Login successful', user: userResponse });
});

// register new user
const userRegister = asyncHandler(async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  // Check if the user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: 'Email already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    password: hashedPassword,
    preferredGenres: req.body.preferredGenres,
    // playedSongsAndCount: req.body.playedSongsAndCount,
    role: req.body.role || 'user', // Default role to 'user' if not provided
  });

  await user.save();

  res.json({
    success: true,
    message: 'Registration successful',
    user: user,
  });
});

// Get user data for view profile page
const userProfileGet = asyncHandler(async (req, res) => {
  const userId = await User.findById(req.params.id);

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.send(user);
});

// Update user information
const userUpdateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const { firstName, lastName, dateOfBirth, preferredGenres } = req.body;

  if (user) {
    user.firstName = firstName || user.firstName.trim();
    user.lastName = lastName || user.lastName.trim();
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.preferredGenres = preferredGenres || user.preferredGenres;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Update successful',
    });
  } else {
    if (!updatedUser) return res.status(404).send('User not found.');
  }
});

// export all Controllers
module.exports = {
  login,
  userUpdateProfile,
  userProfileGet,
  userRegister,
};
