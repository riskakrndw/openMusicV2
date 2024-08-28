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
    console.log("ad1");
    const id = nanoid(16);
    console.log("ad2");

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    console.log("ad3");
    const result = await this._pool.query(query);
    console.log("ad4");

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    console.log("ad5");

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      console.log("gp1", owner);
      const query = {
        text: `
              SELECT 
                playlists.id,
                playlists.name,
                users.username
              FROM playlists 
              INNER JOIN users ON users.id = playlists.owner 
              WHERE owner = $1
            `,
        values: [owner],
      };
      console.log("gp2");
      const result = await this._pool.query(query);
      console.log("gp3");

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

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    console.log("ve1", id, owner);
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    console.log("ve2");
    const result = await this._pool.query(query);
    console.log("ve3");
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    console.log("ve4");
    const playlist = result.rows[0];
    console.log("ve5");
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistByOwner(credentialId) {
    console.log("ve1", credentialId);
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [credentialId],
    };
    console.log("ve2");
    const result = await this._pool.query(query);
    console.log("ve3", !result.rows.length);
    if (!result.rows.length) {
      console.log("masuk er");
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = PlaylistService;
