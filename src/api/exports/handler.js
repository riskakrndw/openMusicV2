class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportSongHandler = this.postExportSongHandler.bind(this);
  }

  async postExportSongHandler(request, h) {
    this._validator.validateExportSongPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      userId: credentialId,
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage("export:song", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Permintaan Anda sedang kami proses",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
