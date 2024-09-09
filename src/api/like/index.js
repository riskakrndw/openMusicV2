const LikeHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "like",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const likeHandler = new LikeHandler(service, validator);

    server.route(routes(likeHandler));
  },
};
