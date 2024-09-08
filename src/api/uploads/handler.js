const ClientError = require("../../exceptions/ClientError");

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    console.log("ssss");

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    console.log("Request Payload:", request.payload);
    console.log("postUploadImageHandler 1");
    const { data } = request.payload;
    console.log("postUploadImageHandler 2");

    this._validator.validateImageHeaders(request.payload.cover.hapi.headers);
    console.log("postUploadImageHandler 3");

    console.log("Type of request.payload.cover:", typeof request.payload.cover);
    console.log(
      "Is request.payload.cover a stream?",
      request.payload.cover instanceof require("stream").Readable
    );
    console.log(
      "Properties of request.payload.cover:",
      Object.keys(request.payload.cover)
    );

    if (!(request.payload.cover instanceof require("stream").Readable)) {
      console.log("errr");
      throw new Error("Invalid cover file. Expected Readable stream.");
    }
    console.log("postUploadImageHandler 4");

    const filename = await this._service.writeFile(
      request.payload.cover,
      request.payload.cover.hapi
    );
    console.log("postUploadImageHandler 4");

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
