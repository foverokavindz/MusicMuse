const users = require('../routes/users');
const songs = require('../routes/songs');
const playlists = require('../routes/playlists');

module.exports = function (app) {
  app.use('/api/users', users);
  app.use('/api/songs', songs);
  app.use('/api/playlists', playlists);
};
