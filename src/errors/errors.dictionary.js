const { ERROR_CODES } = require("./error-codes");

exports.errorsDictionary = {
  [ERROR_CODES.VALIDATION_ERROR]: {
    statusCode: 400,
    message: "los datos enviados no son validos",
  },
  [ERROR_CODES.USER_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro el usuario solicitado",
  },
  [ERROR_CODES.ORDER_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro el pedido solicitado",
  },
  [ERROR_CODES.DELIVERY_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro la entrega solicitada",
  },
  [ERROR_CODES.INVALID_ORDER_STATUS]: {
    statusCode: 400,
    message: "El estado indicado no es valido para un pedido",
  },
  [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
    statusCode: 400,
    message: "El estado indicado no es valido para una entrega",
  },
  [ERROR_CODES.DRIVER_NOT_AVAILABLE]: {
    statusCode: 409,
    message: "El repartidor no esta disponible para tomar una nueva entrega",
  },
  [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
    statusCode: 400,
    message: ":a camtodad de registros a generar debe ser un numero positivo",
  },
  [ERROR_CODES.ROUTE_NOT_FOUND]: {
    statusCode: 404,
    message: "La ruta solicitada no existe",
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    statusCode: 500,
    message: "Ocurrio un error interno en el servidor ",
  },
  [ERROR_CODES.PRODUCT_NOT_FOUND]: {
    statusCode: 404,
    message: "no se encontro el producto",
  },
  [ERROR_CODES.COURIER_NOT_FOUND]: {
    statusCode: 404,
    message: "no se encontro el courier",
  },
  [ERROR_CODES.INVALID_MOCK_RESULTS]: {
    statusCode: 400,
    message: "Debes ingresar un mockResults valido (numero)",
  },
  [ERROR_CODES.MISSING_REQUIRED_FIELDS]: {
    statusCode: 400,
    message: "faltan campos requeridos para poder procesar la solicitud",
  },
  [ERROR_CODES.INVALID_OBJECT_ID]: {
    statusCode: 400,
    message: "El id ingresado no es valido",
  },
  [ERROR_CODES.MISSING_OBJECT_ID]: {
    statusCode: 400,
    message: "Debes ingresar un id",
  },
  [ERROR_CODES.INVALID_PRODUCT_STATE]: {
    statusCode: 400,
    message: "el estado ingresado para el producto es invalido",
  },
};
