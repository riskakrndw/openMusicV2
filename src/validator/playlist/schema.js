const Joi = require("joi");

const PlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistSchema };
