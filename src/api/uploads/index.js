const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    console.log("UploadsHandler1====");
    const uploadsHandler = new UploadsHandler(service, validator);
    console.log("UploadsHandler2====");
    server.route(routes(uploadsHandler));
    console.log("UploadsHandler3====");
  },
};
