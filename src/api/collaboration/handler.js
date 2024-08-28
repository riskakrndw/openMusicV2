const { MapCollaboration } = require("../../utils/index");

class CollaborationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    console.log("request.payload===", request.payload);
    this._validator.validateCollaboration(request.payload);
    console.log("coba2===");

    const { playlistId, userId } = request.payload;
    console.log("coba3===", playlistId, userId, request.auth.credentials);

    const { id: credentialId } = request.auth.credentials;
    console.log("coba4===", credentialId);
    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    console.log("coba5===");
    const collaborationId = await this._service.addCollaboration({
      playlistId,
      userId,
    });

    const response = h.response({
      status: "success",
      message: "Collaboration berhasil ditambahkan",
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    const { playlistId, userId } = request.payload;
    await this._service.deleteCollaboration(playlistId, userId);

    const response = h.response({
      status: "success",
      message: "Collaboration berhasil dihapus",
    });

    response.code(200);
    return response;
  }
}

module.exports = CollaborationHandler;
