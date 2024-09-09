const amqp = require("amqplib");
const { Pool } = require("pg");

const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

const ProducerService = {
  _pool: new Pool(), // Inisialisasi koneksi database

  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);

    await channel.close();
    await connection.close();
  },

  // Tambahkan fungsi verifyPlaylistOwner
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
  },

  async verifyPlaylistByOwner(credentialId) {
    const query = {
      text: "SELECT * FROM playlists WHERE owner = $1",
      values: [credentialId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  },
};

module.exports = ProducerService;
