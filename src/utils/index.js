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

const MapPlaylist = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { MapAlbum, MapSong, MapPlaylist };
