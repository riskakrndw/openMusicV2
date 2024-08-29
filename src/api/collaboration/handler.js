class CollaborationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaboration(request.payload);

    const { playlistId, userId } = request.payload;

    await this._service.isUserExist(userId);
    await this._service.isPlaylistExist(playlistId);

    const { id: credentialId } = request.auth.credentials;
    await this._service.isPlaylistOwner(credentialId, playlistId);

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

    const { id: credentialId } = request.auth.credentials;
    await this._service.isPlaylistOwner(credentialId, playlistId);
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
