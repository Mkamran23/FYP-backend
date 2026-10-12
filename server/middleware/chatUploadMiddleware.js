const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "uploads", "chat-files");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedExtensions = new Set([".jpg", ".jpeg", ".pdf", ".docx"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) =>
    callback(
      null,
      `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
    ),
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype))
    return callback(null, true);
  return callback(new Error("Only JPG, JPEG, PDF, and DOCX files are allowed"));
};

module.exports = {
  chatUpload: multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
  uploadDirectory,
};
