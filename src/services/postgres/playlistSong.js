const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

const { MapPlaylist } = require("../../utils/index");
const { MapSongByPlaylist } = require("../../utils/index");

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: `
              INSERT INTO playlist_song_activities 
              VALUES($1, $2, $3, $4, $5, $6) RETURNING id
            `,
      values: [id, playlistId, songId, userId, action, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Activity gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylistById(playlistId) {
    try {
      const query = {
        text: `
              SELECT 
                playlists.id,
                playlists.name,
                users.username
              FROM playlists 
              INNER JOIN users ON users.id = playlists.owner 
              WHERE playlists.id = $1
            `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError("Playlist tidak ditemukan");
      }

      return result.rows.map(MapPlaylist)[0];
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      throw new Error("Gagal mengambil playlist song dari database");
    }
  }

  async getSongByPlaylist(playlistId) {
    try {
      const query = {
        text: `
              SELECT 
                song.id,
                song.title,
                song.performer
              FROM playlist_songs 
              INNER JOIN song ON song.id = playlist_songs.song_id 
              WHERE playlist_songs.playlist_id = $1
            `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        return [];
      }

      return result.rows.map(MapSongByPlaylist);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      throw new Error("Gagal mengambil playlist song dari database");
    }
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Playlist song gagal dihapus. Id tidak ditemukan"
      );
    }
  }

  async isOwnerOrCollab(credentials) {
    const result = await this._pool.query({
      text: "SELECT * FROM collaborations WHERE user_id = $1",
      values: [credentials],
    });

    if (!result.rows.length) {
      throw new AuthorizationError("No auth");
    }

    return true;
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

  async isPlaylistByOwnerExist(credentialId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Not found");
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
      throw new NotFoundError("Not found");
    }

    return true;
  }

  async isSongExist(songId) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Not found");
    }

    return true;
  }
}

module.exports = PlaylistSongService;
