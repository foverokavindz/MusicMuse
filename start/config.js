const config = require('config');

module.exports = function () {
  if (!config.has('jwtPrivateKey')) {
    console.log(config.get('jwtPrivateKey'));

    throw new Error('FATAL ERROR : jwtPrivateKey is not defined');
  }
};
