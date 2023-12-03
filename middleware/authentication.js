const jwt = require('jsonwebtoken');
const config = require('config');
// route handlers walin authorize person kenekda blnwa me changes krnne
// ekt me funtion eka handles wlin access krnawa

const protect = function (req, res, next) {
  // first check is there a token
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  //then see is it valid?
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; // == req.user._id // methanin gnne payload eka
    next();
  } catch (ex) {
    res.status(400).send('invalid token');
  }
};

const admin = function (req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).send('Access Denied');
  next();
};

module.exports = { protect, admin };
