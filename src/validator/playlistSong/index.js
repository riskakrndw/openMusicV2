const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSongSchema } = require("./schema");

const PlaylistSongValidator = {
  validatePlaylistSong: (payload) => {
    const validationResult = PlaylistSongSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
