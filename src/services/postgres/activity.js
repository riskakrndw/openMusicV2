const { Pool } = require("pg");

const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class ActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities(playlistId) {
    try {
      const query = {
        text: `
                SELECT 
                  users.username,
                  song.title,
                  playlist_song_activities.action,
                  playlist_song_activities.time
                FROM playlist_song_activities 
                INNER JOIN users ON users.id = playlist_song_activities.user_id
                INNER JOIN song ON song.id = playlist_song_activities.song_id
                WHERE 
                  playlist_song_activities.playlist_id = $1
              `,
        values: [playlistId],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError("Album tidak ditemukan");
      }

      return result.rows;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch songs from the database.");
    }
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

  async isPlaylistOwner(credentialId, playlistId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1 AND id = $2",
      values: [credentialId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("No auth");
    }

    return true;
  }
}

module.exports = ActivityService;
