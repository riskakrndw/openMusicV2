const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
];

module.exports = routes;
