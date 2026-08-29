const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");
const { DOCUMENT_TYPES } = require("../constants");
const logger = require("../config/logger");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

const UPLOAD_CONFIGS = {
  userDocument: {
    fieldName: "document",
    documentType: DOCUMENT_TYPES.USER_DOCUMENT,
    folder: "documents",
  },
  courierLicense: {
    fieldName: "license",
    documentType: DOCUMENT_TYPES.DRIVER_LICENSE,
    folder: "licenses",
  },
  orderProof: {
    fieldName: "proof",
    documentType: DOCUMENT_TYPES.DELIVERY_PROOF,
    folder: "proofs",
  },
};

function createStorage(folder) {
  return multer.diskStorage({
    destination(req, file, callback) {
      const destination = path.join(UPLOAD_ROOT, folder);

      fs.mkdir(destination, { recursive: true }, (error) => {
        if (error) {
          logger.error("No se pudo crear la carpeta de uploads", {
            destination,
            error: error.message,
          });
          callback(new AppError(ERROR_CODES.UPLOAD_ERROR));
          return;
        }
        callback(null, destination);
      });
    },

    filename(req, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    },
  });
}

function fileFilter(req, file, callback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    logger.warning("Intento de subir un tipo de archivo no permitido", {
      mimeType: file.mimetype,
      originalName: file.originalname,
    });
    callback(new AppError(ERROR_CODES.INVALID_FILE_TYPE));
    return;
  }

  callback(null, true);
}

async function removeUploadedFile(fileOrPath) {
  const filePath =
    typeof fileOrPath === "string" ? fileOrPath : fileOrPath?.path;
  if (!filePath) return;

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(`${UPLOAD_ROOT}${path.sep}`)) return;

  await fsPromises.rm(resolvedPath, { force: true });
}

function mapMulterError(error, expectedField) {
  if (error instanceof AppError) return error;

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new AppError(ERROR_CODES.FILE_TOO_LARGE);
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return new AppError(
        ERROR_CODES.INVALID_FILE_FIELD,
        `El archivo debe enviarse en el campo '${expectedField}'`,
      );
    }
  }

  return new AppError(ERROR_CODES.UPLOAD_ERROR, undefined, {
    cause: error.message,
  });
}

function createUploadMiddleware(config) {
  const singleUpload = multer({
    storage: createStorage(config.folder),
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
  }).single(config.fieldName);

  return (req, res, next) => {
    singleUpload(req, res, async (error) => {
      if (error) {
        const uploadError = mapMulterError(error, config.fieldName);
        logger.warning("Carga de archivo rechazada", {
          code: uploadError.code,
          route: req.originalUrl,
        });
        await removeUploadedFile(req.file).catch(() => undefined);
        next(uploadError);
        return;
      }

      if (!req.file) {
        next(new AppError(ERROR_CODES.FILE_REQUIRED));
        return;
      }

      if (req.body.type !== config.documentType) {
        logger.warning("Tipo de documento invalido", {
          received: req.body.type,
          expected: config.documentType,
          route: req.originalUrl,
        });
        await removeUploadedFile(req.file).catch(() => undefined);
        req.file = undefined;
        next(
          new AppError(
            ERROR_CODES.INVALID_DOCUMENT_TYPE,
            `El tipo de documento permitido es '${config.documentType}'`,
          ),
        );
        return;
      }

      req.documentType = config.documentType;
      next();
    });
  };
}

module.exports = {
  uploadUserDocument: createUploadMiddleware(UPLOAD_CONFIGS.userDocument),
  uploadCourierLicense: createUploadMiddleware(UPLOAD_CONFIGS.courierLicense),
  uploadOrderProof: createUploadMiddleware(UPLOAD_CONFIGS.orderProof),
  removeUploadedFile,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES: [...ALLOWED_MIME_TYPES],
};
