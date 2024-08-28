const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    console.log("col1===", playlistId, userId);
    const id = nanoid(16);
    console.log("col1.2");

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };
    console.log("col2");

    try {
      const result = await this._pool.query(query);
      console.log("col3");

      if (!result.rows[0].id) {
        throw new InvariantError("Collaboration gagal ditambahkan");
      }
      console.log("add5");

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
}

module.exports = CollaborationService;
