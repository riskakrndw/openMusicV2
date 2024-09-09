const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Pool } = require("pg"); // Tambahkan ini di bagian atas

class StorageService {
  constructor() {
    this._S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this._pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
  }

  async streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async writeFile(file, meta) {
    const buffer = await this.streamToBuffer(file);
    const parameter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: buffer,
      ContentType: meta.headers["content-type"],
    });

    try {
      await this._S3.send(parameter);
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }

    return this.createPreSignedUrl({
      bucket: process.env.AWS_BUCKET_NAME,
      key: meta.filename,
    });
  }

  createPreSignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this._S3, command, { expiresIn: 3600 });
  }

  async addCoverUrl(id, fileLocation) {
    try {
      console.log("addCoverUrl 1", id, fileLocation);
      const query = {
        text: "UPDATE album SET cover_url = $1 WHERE id = $2 RETURNING id",
        values: [fileLocation, id],
      };
      console.log("addCoverUrl 2");

      const result = await this._pool.query(query);
      console.log("addCoverUrl 3");

      if (!result.rows.length) {
        throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
      }
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch songs from the database.");
    }
  }
}

module.exports = StorageService;
