const InvariantError = require("../../exceptions/InvariantError");
const { ImageHeadersSchema } = require("./schema");

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    console.log("Headers diterima untuk validasi:", headers);
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      console.log("Validasi gagal:", validationResult.error.message);
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
