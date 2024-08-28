const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationSchema } = require("./schema");

const CollaborationValidator = {
  validateCollaboration: (payload) => {
    console.log("vd1");
    const validationResult = CollaborationSchema.validate(payload);
    console.log("vd2");

    if (validationResult.error) {
      console.log("vd3", validationResult.error);
      throw new InvariantError(validationResult.error.message);
    }
    console.log("vd4");
  },
};

module.exports = CollaborationValidator;
