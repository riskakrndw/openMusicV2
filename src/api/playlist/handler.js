class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylist(request.payload);
    console.log("po1==");

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    console.log("po2==", credentialId);

    // await this._service.verifyPlaylistOwner(id, credentialId);
    console.log("po5");
    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });
    console.log("po6");

    const response = h.response({
      status: "success",
      message: "Playlists berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    console.log("po7");

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    console.log("g1");
    const { id: credentialId } = request.auth.credentials;
    console.log("g2");

    // await this._service.verifyPlaylistByOwner(credentialId);
    const playlists = await this._service.getPlaylists(credentialId);
    console.log("g3", playlists);

    const response = h.response({
      status: "success",
      data: {
        playlists: playlists,
      },
    });
    console.log("g4");

    response.code(200);
    return response;
  }

  async deletePlaylistHandler(request, h) {
    console.log("del1");
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    console.log("del2");

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylist(id);
    console.log("del3");

    const response = h.response({
      status: "success",
      message: "Playlist berhasil dihapus",
    });
    console.log("del4");

    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler;
