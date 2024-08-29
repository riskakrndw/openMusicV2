const routes = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getActivitiesHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
];

module.exports = routes;
