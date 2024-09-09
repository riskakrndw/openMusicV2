class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    this._validator.validateImageHeaders(request.payload.cover.hapi.headers);

    if (!(request.payload.cover instanceof require("stream").Readable)) {
      throw new Error("Invalid cover file. Expected Readable stream.");
    }

    const fileLocation = await this._service.writeFile(
      request.payload.cover,
      request.payload.cover.hapi
    );

    const { id } = request.params;
    await this._service.addCoverUrl(id, fileLocation);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation: fileLocation,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
