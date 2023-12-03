const asyncHandler = require('express-async-handler');
const { User } = require('../models/user');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const getHomePageSongs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).send('user not found');
    return;
  }

  // Access the preferredGenres field
  const userPreferredGenres = [...user.preferredGenres];
  const songArray = []; // Array to store song data

  for (let i = 0; i < 15; i++) {
    // Select a random index from the array
    const randomIndex = Math.floor(Math.random() * userPreferredGenres.length);
    const randomGenre = userPreferredGenres[randomIndex];

    // Fetch data from Spotify API and append to songArray
    const trackData = await getTrackFromGenre(randomGenre);
    songArray.push(trackData);
  }

  res.json({
    payload: songArray,
  });
});

const addSongToHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const { spotifySongId } = req.body;

  // Check if the song is already in playedSongsAndCount array object
  const playedSongIndex = user.playedSongsAndCount.findIndex(
    (song) => song.spotifySongId === spotifySongId
  );

  if (playedSongIndex !== -1) {
    // Song exists, increment count
    user.playedSongsAndCount[playedSongIndex].count += 1;
  } else {
    // Song doesn't exist, add a new entry
    user.playedSongsAndCount.push({
      spotifySongId,
      count: 1,
    });
  }

  if (user.playedSongsHistory.length != 0) {
    const lastHistoryIndex = user.playedSongsHistory.length - 1;
    const lastHistory = user.playedSongsHistory[lastHistoryIndex];

    if (lastHistory.spotifySongId != spotifySongId) {
      // The last history entry is similar, do not add a new entry
      // add a new history  entry
      user.playedSongsHistory.push({
        spotifySongId,
      });
    }
  } else {
    user.playedSongsHistory.push({
      spotifySongId,
    });
  }

  // Save the updated user
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Update successful',
    user: [
      { playedSongsAndCount: updatedUser.playedSongsAndCount },
      { playedSongsHistory: updatedUser.playedSongsHistory },
    ],
  });
});

// Get recently played songs for a user
const getRecentlyPlayed = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (user.playedSongsHistory.length === 0) {
    console.log('No played songs history for this user');
    res.json({ message: 'No played songs history for this user' });
    return;
  }

  const recentPlayedList = [...user.playedSongsHistory];
  //console.log('recentPlayedList - ', recentPlayedList);

  const songArray = []; // Array to store song data

  count = recentPlayedList.length - 1;
  while (count >= 0) {
    // Fetch data from Spotify API and append to songArray
    const trackData = await getTrackFromId(
      recentPlayedList[count].spotifySongId
    );
    songArray.push(trackData);
    //console.log('songArray ', songArray);
    count--;
  }

  res.json({
    payload: songArray,
  });
});

const getMostLikedPlaylist = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  // need to implement function for new user
  const playedSongsAndCount = user.playedSongsAndCount.length;
  const recentPlayedList = [...user.playedSongsHistory];
  const userPreferredGenres = [...user.preferredGenres];

  const songArrayOne = [];
  const songArrayTwo = [];
  const songArrayThree = [];

  const getTop3Songs = () => {
    // Sort the playedSongsAndCount
    const sortedSongs = user.playedSongsAndCount.sort(
      (a, b) => b.count - a.count
    );
    // Select the top 3 songs
    const top3Songs = sortedSongs.slice(0, 3);
    // Extract spotifySongId values
    const top3SongIds = top3Songs.map((song) => song.spotifySongId);
    return top3SongIds;
  };

  if (playedSongsAndCount > 3) {
    const top3Songs = getTop3Songs();
    console.log('top3Songs ', top3Songs);

    for (i = 0; i < top3Songs.length; i++) {
      const trackData = await getTrackFromId(top3Songs[i]);
      console.log('trackData  ', trackData);
      console.log('top3Songs[i]   ', top3Songs[i]);
      songArrayOne.push(trackData);
      songArrayTwo.push(trackData);
      songArrayThree.push(trackData);
    }
  } else {
    console.log(
      'Not enough entries in playedSongsAndCount to determine top 3 songs.'
    );
  }

  // console.log('arrays ----- ', songArrayOne, songArrayTwo, songArrayThree);

  if (user.playedSongsHistory.length > 3) {
    count = 0;
    while (count < 3) {
      const trackData = await getTrackFromId(recentPlayedList[count]);
      songArrayOne.push(trackData);
      songArrayTwo.push(trackData);
      songArrayThree.push(trackData);
      count++;
    }
  } else {
    console.log('Not enough entries in history');
  }

  for (let i = 0; i < 3; i++) {
    // Select a random index from the array
    const randomIndex = Math.floor(Math.random() * userPreferredGenres.length);
    const randomGenre = userPreferredGenres[randomIndex];

    // Fetch data from Spotify API and append to songArray
    const trackData = await getTrackFromGenre(randomGenre);
    songArrayOne.push(trackData);
    songArrayTwo.push(trackData);
    songArrayThree.push(trackData);
  }

  res.json({
    payload: {
      playlistOne: songArrayOne,
      playlistTwo: songArrayTwo,
      playlistThree: songArrayThree,
    },
  });
});

// export all Controllers
module.exports = {
  getHomePageSongs,
  addSongToHistory,
  getRecentlyPlayed,
  getMostLikedPlaylist,
};

// utility functions

const getTrackFromGenre = async (genreName) => {
  const api_url = `https://api.spotify.com/v1/search?query=genre%3D%22${genreName}%22&type=track&offset=0&limit=1`;

  //console.log(api_url);
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
    });
    // console.log(response.data);

    const trackData = response.data.tracks.items[0];
    const { href, id, name, uri, artists } = trackData;
    const imageUrl = trackData.album.images[0].url;

    const data = {
      songHref: href,
      songId: id,
      songName: name,
      songUri: uri,
      songImageUrl: imageUrl,
      songArtists: artists,
    };

    // console.log('data', data);
    return data;
  } catch (error) {
    console.log(error);
  }
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
