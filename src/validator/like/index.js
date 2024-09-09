const InvariantError = require("../../exceptions/InvariantError");
const { LikeSchema } = require("./schema");

const LikeValidator = {
  validateCollaboration: (payload) => {
    const validationResult = LikeSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = LikeValidator;
