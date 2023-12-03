const express = require('express');
const router = express.Router();

const {
  getHomePageSongs,
  addSongToHistory,
  getRecentlyPlayed,
  getMostLikedPlaylist,
} = require('../controllers/songsController');

router.route('/get-homepage-songs/:id').get(getHomePageSongs);
router.route('/history/:id').get(getRecentlyPlayed).put(addSongToHistory);
router.route('/most-liked-playlist/:id').get(getMostLikedPlaylist);

module.exports = router;
