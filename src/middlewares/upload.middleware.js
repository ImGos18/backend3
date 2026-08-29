const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AppError = require("./../errors/AppError");
const ERROR_CODES = require("./../errors/error-codes");
const { DOCUMENT_TYPES } = require("./../constants/index");

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/wepg",
  "text/plain",
];

function ensureFolderExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

function getDestinationFolder(req) {
  const documentType = req.body?.type;

  if (documentType === DOCUMENT_TYPES.DRIVER_LICENSE) {
    return "uploads/licenses";
  }
  if (
    documentType === DOCUMENT_TYPES.DELIVERY_PROOF ||
    req.originalUrl.includes("/proof")
  ) {
    return "uploads/proofs";
  }

  return "uploads/documents";
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = getDestinationFolder(req);
    ensureFolderExists(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, fileName);
  },
});

function fileFilter(req, file, cb) {
  const type = req.body.type;

  if (!type || !Object.values(DOCUMENT_TYPES).includes(type)) {
    return cb(
      new AppError(
        ERROR_CODES.INVALID_DOCUMENT_TYPE,
        "Debes indicar el tipo de archivo",
      ),
    );
  }

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  return cb(
    new AppError(
      ERROR_CODES.INVALID_FILE_TYPE,
      "el tipo de archivo no es valido",
    ),
  );
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
