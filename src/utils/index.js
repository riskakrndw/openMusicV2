const MapAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const MapSong = ({ id, title, year, performer, genre, duration, albumId }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

const MapSongByPlaylist = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const MapPlaylist = ({ id, name, username }) => ({
  id,
  name,
  username,
});

const MapActivity = ({ username, title, action, time }) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  MapAlbum,
  MapSong,
  MapSongByPlaylist,
  MapPlaylist,
  MapActivity,
};
