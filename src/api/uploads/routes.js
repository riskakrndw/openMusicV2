const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
      },
    },
  },
];

console.log("Route /albums/{id}/covers terdaftar");

module.exports = routes;
