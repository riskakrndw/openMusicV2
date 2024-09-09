const Joi = require("joi");

const LikeSchema = Joi.object({
  userId: Joi.string().required(),
  albumId: Joi.string().required(),
});

module.exports = { LikeSchema };
