const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { MapSong } = require("../../utils/index");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);

    if (albumId == undefined || duration == undefined) {
      albumId = null;
    }

    const query = {
      text: "INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, albumId, title, year, genre, performer, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = "SELECT id, title, performer FROM song";

    if (title != "" && performer != "") {
      query = {
        text: "SELECT id, title, performer FROM song WHERE title ILIKE $1 AND performer ILIKE $2",
        values: ["%" + title + "%", "%" + performer + "%"],
      };
    } else if (title != "") {
      query = {
        text: "SELECT id, title, performer FROM song WHERE title ILIKE $1",
        values: ["%" + title + "%"],
      };
    } else if (performer != "") {
      query = {
        text: "SELECT id, title, performer FROM song WHERE performer ILIKE $1",
        values: ["%" + performer + "%"],
      };
    }

    try {
      const result = await this._pool.query(query);
      return result.rows.map(MapSong);
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch songs from the database.");
    }
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows.map(MapSong)[0];
  }

  async editSong(id, { title, year, performer, genre, duration, albumId }) {
    if (albumId === undefined) {
      albumId = null;
    }

    const query = {
      text: 'UPDATE song SET "albumId" = $1, title = $2, year = $3, genre = $4, performer = $5, duration = $6 WHERE id = $7 RETURNING id',
      values: [albumId, title, year, genre, performer, duration, id],
    };

    // const result = await this._pool.query(query);
    let result;
    try {
      result = await this._pool.query(query);
    } catch (error) {
      console.error("Database error:", error);
      throw new InvariantError(
        "Song gagal ditambahkan karena masalah pada database."
      );
    }

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }
  }

  async deleteSong(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongService;
