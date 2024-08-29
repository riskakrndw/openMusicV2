const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSchema } = require("./schema");

const PlaylistValidator = {
  validatePlaylist: (payload) => {
    const validationResult = PlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
