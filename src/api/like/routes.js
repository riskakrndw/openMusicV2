const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikeHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikeHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteLikeHandler,
    options: {
      auth: "open_music_app_jwt",
    },
  },
];

module.exports = routes;
