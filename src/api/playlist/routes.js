const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
];

module.exports = routes;
