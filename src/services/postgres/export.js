const { Pool } = require("pg");

const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class ExportService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner) {
    console.log("verifyPlaylistOwner 1");
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    console.log("verifyPlaylistOwner 2");
    const result = await this._pool.query(query);
    console.log("verifyPlaylistOwner 3");

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    console.log("verifyPlaylistOwner 4");
    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistByOwner(credentialId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [credentialId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = ExportService;
