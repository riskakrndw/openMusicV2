const ActivityHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "activities",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const activityHandler = new ActivityHandler(service, validator);

    server.route(routes(activityHandler));
  },
};
