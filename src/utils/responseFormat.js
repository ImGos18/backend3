/**
 * crea un formato estandar para que todas las respuestas que se resuelvan de forma satisfactoria tengan el mismo formato
 *
 * @param {import('express').Request} req - Objeto req de express
 * @param {import('express').Response} res - Objeto res de express
 * @param {number} statusCode - codigo http de respuesta
 * @param {any} data - array con datos a mostrar en la respuesta
 * @returns {Object} respuesta http
 *
 * @example
 * responseFormat(req,res,200,[{info}]);
 * {
    "status": "success",
    "results": 1,
    "data": [ info]
}
 */

function responseFormat(req, res, statusCode, data) {
  return res
    .status(statusCode)
    .json({ status: "success", results: data.length || 1, data: data });
}

module.exports = responseFormat;
