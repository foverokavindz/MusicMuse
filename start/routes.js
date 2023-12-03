const users = require('../routes/users');
const songs = require('../routes/songs');
// const categories = require('../routes/categories');
// const mycart = require('../routes/mycart');
// const orders = require('../routes/orders');

module.exports = function (app) {
  app.use('/api/users', users);
  app.use('/api/songs', songs);
  // app.use('/api/categories', categories);
  // app.use('/api/mycart', mycart);
  // app.use('/api/orders', orders);
};
