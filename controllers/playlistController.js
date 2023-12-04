const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { Playlist } = require('../models/playlist');

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
  // post

  const { name, description, creator, songs } = req.body;

  const playlist = new Playlist({
    name,
    description,
    creator,
    songs,
  });

  const savedPlaylist = await playlist.save();
  res.json(savedPlaylist);
});

// Get all playlists
const getPlaylists = asyncHandler(async (req, res) => {
  try {
    const playlists = await Playlist.find();

    // Iterate through each playlist
    const playlistsWithSongsInfo = await Promise.all(
      playlists.map(async (playlist) => {
        const songsInfo = await Promise.all(
          playlist.songs.map(async (song) => {
            // Extract detailed information about each song, replace this with your logic
            const trackData = await getTrackFromId(song.spotifySongId);

            return trackData;
          })
        );

        // Return the playlist along with detailed information about songs
        return {
          _id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          creator: playlist.creator,
          createdAt: playlist.createdAt,
          songs: songsInfo.data,
        };
      })
    );

    res.json(playlistsWithSongsInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific playlist by ID
const getPlaylistbyId = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  const playlistDatafromSpotify = [];
  for (let i = 0; i < playlist.songs.length; i++) {
    const trackData = await getTrackFromId(playlist.songs.spotifySongId);
    playlistDatafromSpotify.push(trackData);
  }

  playlist.songs = playlistDatafromSpotify;

  res.json(playlist);
});


// Update a playlist by ID - #TODO not tested
const updatePlaylistById = asyncHandler(async (req, res) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// export all Controllers
module.exports = {
  updatePlaylistById,
  getPlaylistbyId,
  getPlaylists,
  createPlaylist,
};

const getTrackFromId = async (trackId) => {
  const api_url = `https://api.spotify.com/v1/tracks/${trackId}`;

  //console.log(api_url);
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
    });
    //console.log('responce data - ', response.data);

    const { href, id, name, uri, artists } = response.data;
    const imageUrl = response.data.album.images[0].url;

    const data = {
      songHref: href,
      songId: id,
      songName: name,
      songUri: uri,
      songImageUrl: imageUrl,
      songArtists: artists,
    };

    //console.log('data', data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
