const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { MapAlbum } = require("../../utils/index");
const { MapSong } = require("../../utils/index");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    console.log("add1");
    const id = nanoid(16);
    console.log("add2");

    const query = {
      text: "INSERT INTO album VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };
    console.log("add3");

    const result = await this._pool.query(query);
    console.log("add4");

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    console.log("add5");

    return result.rows[0].id;
  }

  async getAlbum() {
    const result = await this._pool.query("SELECT * FROM album");

    return result.rows.map(MapAlbum);
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return result.rows.map(MapAlbum)[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM song WHERE "albumId" = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    return result.rows.map(MapSong);
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: "UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbum(id) {
    const query = {
      text: "DELETE FROM album WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
