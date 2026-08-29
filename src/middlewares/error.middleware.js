const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");
const config = require("../config/index");
const logger = require("../config/logger");
const { removeUploadedFile } = require("./upload.middleware");

exports.notFoundHandler = (req, res, next) => {
  const error = new AppError("La ruta solicitada no existe");
  error.code = ERROR_CODES.ROUTE_NOT_FOUND;
  error.statusCode = 404;
  error.isOperational = true;
  error.message = "la ruta no existe";

  logger.warning(`Ruta no encontrada: ${req.originalUrl}`);
  next(error);
};

exports.errorHandler = async (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || ERROR_CODES.INTERNAL_SERVER_ERROR;

  const response = {
    status: "error",
    error: errorCode,
    message: error.message || "ocurrio un error interno en el servidor",
  };

  if (error instanceof AppError) {
    logger.warning(error.message);
  } else {
    logger.error("error inesperado: ", error);
  }

  if (config.NODE_ENV === "development" && error.details) {
    response.details = error.details;
  }

  if (req.file) {
    try {
      await removeUploadedFile(req.file);
      logger.info("Archivo de una carga fallida eliminado", {
        route: req.originalUrl,
      });
    } catch (cleanupError) {
      logger.error("No se pudo eliminar un archivo de una carga fallida", {
        path: req.file.path,
        error: cleanupError.message,
      });
    }
  }

  res.status(statusCode).json(response);
};
