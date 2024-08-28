const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._song = [];
  }

  addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);

    const newSong = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };

    this._song.push(newSong);

    const isSuccess = this._song.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return id;
  }

  getSongs() {
    return this._song;
  }

  getSongById(id) {
    const song = this._song.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError("Song tidak ditemukan");
    }
    return song;
  }

  editSong(id, { title, year, performer, genre, duration, albumId }) {
    const index = this._song.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }

    this._song[index] = {
      ...this._song[index],
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };
  }

  deleteSong(id) {
    const index = this._song.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }
    this._song.splice(index, 1);
  }
}

module.exports = SongService;
