class LikeHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.getLikeHandler = this.getLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.isAlbumExist(albumId);

    await this._service.addLike(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Like berhasil ditambahkan",
    });

    response.code(201);
    return response;
  }

  async getLikeHandler(request, h) {
    const { id: albumId } = request.params;

    const data_like = await this._service.getLike(albumId);

    const response = h.response({
      status: "success",
      data: {
        likes: +data_like.cnt,
      },
    });

    response.code(200);

    if (data_like.source === "cache") {
      response.header("X-Data-Source", "cache");
    }

    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.isAlbumExist(albumId);

    await this._service.deleteLike(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Like berhasil dihapus",
    });

    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
