const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSchema } = require("./schema");

const PlaylistValidator = {
  validatePlaylist: (payload) => {
    console.log("v1");
    const validationResult = PlaylistSchema.validate(payload);
    console.log("v2");

    if (validationResult.error) {
      console.log("errr===", validationResult.error);
      throw new InvariantError(validationResult.error.message);
    }
    console.log("v3");
  },
};

module.exports = PlaylistValidator;
