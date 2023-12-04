const express = require('express');
const router = express.Router();

const {
  updatePlaylistById,
  getPlaylistbyId,
  getPlaylists,
  createPlaylist,
} = require('../controllers/playlistController');

router.route('/:id').put(updatePlaylistById).get(getPlaylistbyId);
router.route('/').get(getPlaylists).post(createPlaylist);

module.exports = router;
