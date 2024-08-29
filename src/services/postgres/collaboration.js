const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError("Collaboration gagal ditambahkan");
      }

      return result.rows[0].id;
    } catch (error) {
      console.error("Query Error:", error);
      throw new InvariantError("Collaboration gagal ditambahkan");
    }
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Collaboration gagal dihapus. Id tidak ditemukan"
      );
    }
  }

  async isPlaylistOwner(credentials, playlistId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1 AND id = $2",
      values: [credentials, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("No auth");
    }

    return true;
  }

  async isUserExist(userId) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return true;
  }

  async isPlaylistExist(playlistId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return true;
  }
}

module.exports = CollaborationService;
