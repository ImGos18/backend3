/**
 * crea un formato estandar para que todas las respuestas que se resuelvan de forma satisfactoria tengan el mismo formato
 *
 * @param {object} req - Objeto req de express
 * @param {object} res - Objeto res de express
 * @param {number} statusCode - codigo http de respuesta
 * @param {any} data - array con datos a mostrar en la respuesta
 * @returns {Object} Precio final con descuento aplicado.
 *
 * @example
 * responseFormat(req,res,200,[{info}]);
 * {
    "status": "sucess",
    "results": 1,
    "data": [ info]
}
 */

function responseFormat(req, res, statusCode, data) {
  return res
    .status(statusCode)
    .json({ status: "sucess", results: data.length || 1, data: data });
}

module.exports = responseFormat;
