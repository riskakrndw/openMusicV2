class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSong(request.payload);

    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Song berhasil ditambahkan",
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title = "" } = request.query;
    const { performer = "" } = request.query;
    let songs = [];

    songs = await this._service.getSongs(title, performer);

    const response = h.response({
      status: "success",
      data: {
        songs,
      },
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: "success",
      data: {
        song,
      },
    });

    response.code(200);
    return response;
  }

  async putSongHandler(request, h) {
    this._validator.validateSong(request.payload);

    const { id } = request.params;
    await this._service.editSong(id, request.payload);

    const response = h.response({
      status: "success",
      message: "Song berhasil diperbarui",
    });

    response.code(200);
    return response;
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSong(id);

    const response = h.response({
      status: "success",
      message: "Song berhasil dihapus",
    });

    response.code(200);
    return response;
  }
}

module.exports = SongHandler;
