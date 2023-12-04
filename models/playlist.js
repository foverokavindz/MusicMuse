const mongoose = require('mongoose');
const { User } = require('./user');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  description: {
    type: String,
    maxlength: 1024,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User, // Reference to the User model
    required: true,
  },
  songs: [
    {
      spotifySongId: {
        type: String,
        required: true,
        default: '',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
