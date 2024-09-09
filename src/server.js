require("dotenv").config();

const ClientError = require("./exceptions/ClientError");

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const path = require("path");

// album
const album = require("./api/album");
const AlbumService = require("./services/postgres/album");
const AlbumValidator = require("./validator/album");

// song
const song = require("./api/song");
const SongService = require("./services/postgres/song");
const SongValidator = require("./validator/song");

// user
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentication
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// playlist
const playlist = require("./api/playlist");
const PlaylistService = require("./services/postgres/playlist");
const PlaylistValidator = require("./validator/playlist");

// playlist song
const playlistSong = require("./api/playlistSong");
const PlaylistSongService = require("./services/postgres/playlistSong");
const PlaylistSongValidator = require("./validator/playlistSong");

// collaboration
const collaboration = require("./api/collaboration");
const CollaborationService = require("./services/postgres/collaboration");
const CollaborationValidator = require("./validator/collaboration");

// activity
const activity = require("./api/activity");
const ActivityService = require("./services/postgres/activity");

// Exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/S3/StorageService");
const UploadsValidator = require("./validator/uploads");

// like
const like = require("./api/like");
const LikeService = require("./services/postgres/like");
const LikeValidator = require("./validator/like");

// cache
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const collaborationService = new CollaborationService();
  const activityService = new ActivityService();
  const storageService = new StorageService();
  const likeService = new LikeService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("open_music_app_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSong,
      options: {
        service: playlistSongService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        service: collaborationService,
        validator: CollaborationValidator,
      },
    },
    {
      plugin: activity,
      options: {
        service: activityService,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: like,
      options: {
        service: likeService,
        validator: LikeValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
