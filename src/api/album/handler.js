class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbum(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);

    const response = h.response({
      status: "success",
      data: {
        album: {
          id: album["id"],
          name: album["name"],
          year: album["year"],
          songs: songs,
        },
      },
    });

    response.code(200);
    return response;
  }

  async putAlbumHandler(request, h) {
    this._validator.validateAlbum(request.payload);

    const { id } = request.params;

    await this._service.editAlbum(id, request.payload);

    const response = h.response({
      status: "success",
      message: "Album berhasil diperbarui",
    });

    response.code(200);
    return response;
  }

  async deleteAlbumHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbum(id);

    const response = h.response({
      status: "success",
      message: "Album berhasil dihapus",
    });

    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;
