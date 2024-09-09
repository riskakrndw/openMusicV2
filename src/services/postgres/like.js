const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");
const ClientError = require("../../exceptions/ClientError");

class LikeService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(credentialId, albumId) {
    const id = nanoid(16);

    const query_validation = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [credentialId, albumId],
    };
    const result_validation = await this._pool.query(query_validation);
    if (result_validation.rows.length) {
      throw new ClientError("sudah pernah like");
    }

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, credentialId, albumId],
    };

    if (!result.rows[0].id) {
      throw new InvariantError("Like gagal ditambahkan");
    }
  }

  async getLike(albumId) {
    const query = {
      text: "SELECT COUNT(id) AS cnt FROM user_album_likes WHERE album_id = $1 GROUP BY album_id",
      values: [albumId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteLike(credentialId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [credentialId, albumId],
    };

    const result = await this._pool.query(query);
  }

  async isAlbumExist(albumId) {
    const query = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Not found");
    }

    return true;
  }
}

module.exports = LikeService;
