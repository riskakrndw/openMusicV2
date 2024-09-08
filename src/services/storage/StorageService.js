const fs = require("fs");
const { Readable } = require("stream");

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;
    console.log("Writing file to path:", path);
    console.log("file===");

    console.log("file type:", typeof file);
    console.log(
      "file isReadableStream:",
      file instanceof require("stream").Readable
    );

    if (!(file instanceof Readable)) {
      throw new Error("Invalid file stream. Expected Readable stream.");
    }

    console.log("writeFile 1");
    if (!file || !file.pipe) {
      throw new Error("Invalid file stream.");
    }

    const fileStream = fs.createWriteStream(path);
    console.log("writeFile 2");

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => {
        console.error("Error writing file:", error);
        reject(error);
      });

      file.on("error", (error) => {
        console.error("Error with file stream:", error);
        reject(error);
      });

      fileStream.on("finish", () => {
        console.log("File written successfully:", filename);
        resolve(filename);
      });

      file.on("data", (chunk) => {
        console.log("Received chunk of size:", chunk.length);
      });

      file.on("end", () => {
        console.log("File stream ended");
      });

      file.pipe(fileStream);
    });
  }
}

module.exports = StorageService;
