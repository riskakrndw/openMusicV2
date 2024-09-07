const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportSongHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
];

module.exports = routes;
