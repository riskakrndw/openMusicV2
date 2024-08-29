class PlaylistSongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSong(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.isPlaylistExist(playlistId);
    await this._service.isOwnerOrCollab(credentialId);
    await this._service.isSongExist(songId);

    const playlistSongId = await this._service.addPlaylistSong({
      playlistId,
      songId,
    });
    await this._service.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: "add",
    });

    const response = h.response({
      status: "success",
      message: "Playlists berhasil ditambahkan",
      data: {
        playlistSongId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: playlistId } = request.params;
    await this._service.isPlaylistExist(playlistId);

    const { id: credentialId } = request.auth.credentials;
    await this._service.isOwnerOrCollab(credentialId);

    const playlist = await this._service.getPlaylistById(playlistId);
    const songs = await this._service.getSongByPlaylist(playlistId);

    const response = h.response({
      status: "success",
      data: {
        playlist: {
          id: playlist.id || "unknown",
          name: playlist.name || "unknown",
          username: playlist.username || "unknown",
          songs: songs,
        },
      },
    });

    response.code(200);
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSong(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this._service.isOwnerOrCollab(credentialId);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._service.deletePlaylistSong(playlistId, songId);
    await this._service.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: "delete",
    });

    const response = h.response({
      status: "success",
      message: "Playlist berhasil dihapus",
    });

    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongHandler;
