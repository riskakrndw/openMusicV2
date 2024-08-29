const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { MapPlaylist } = require("../../utils/index");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    try {
      const id = `playlist-${nanoid(16)}`;

      const result = await this._pool.query({
        text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
        values: [id, name, owner],
      });

      if (!result.rows[0].id) {
        throw new InvariantError("Playlist gagal ditambahkan");
      }

      await this._pool.query({
        text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
        values: [id, result.rows[0].id, owner],
      });

      return result.rows[0].id;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw new Error("Gagal mengambil playlist dari database");
    }
  }

  async getPlaylists(owner) {
    try {
      const query = {
        text: `
              SELECT 
                playlists.id,
                playlists.name,
                users.username
              FROM collaborations
              INNER JOIN playlists ON playlists.id = collaborations.playlist_id
              INNER JOIN users ON users.id = playlists.owner 
              WHERE collaborations.user_id = $1
            `,
        values: [owner],
      };
      const result = await this._pool.query(query);

      return result.rows.map(MapPlaylist);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw new Error("Gagal mengambil playlist dari database");
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    await this._pool.query({
      text: "DELETE FROM collaborations WHERE playlist_id = $1 RETURNING id",
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
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

module.exports = PlaylistService;
