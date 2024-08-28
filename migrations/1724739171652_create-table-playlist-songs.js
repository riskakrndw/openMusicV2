/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  // memberikan constraint foreign key
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_songs_playlists.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_songs_songs.id",
    "FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_songs_playlists.id"
  );

  pgm.dropConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlist_songs_songs.id"
  );

  pgm.dropTable("playlist_songs");
};
