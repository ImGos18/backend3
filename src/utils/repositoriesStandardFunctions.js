/**
 *
 * @param {import('mongoose').Model<any>} Model
 * @param {Object} data
 * @returns {Object} - documento creado en base de datos
 *
 * @description
 * Esta función se utiliza para crear un nuevo documento en la base de datos.
 
 */
const create = async (Model, data) => {
  const result = await Model.create(data);
  return result;
};

/**
 *
 * @param {import("mongoose").Model} Model - Modelo de la base de datos
 * @param {number} page - Número de página
 * @param {number} limit - Número de elementos por página
 * @returns {Array} - Lista de documentos paginados
 *
 * @description
 * Esta función se utiliza para obtener una lista de documentos de una base de datos
 * paginados. Recibe el modelo de la base de datos,
 *
 */
const getAll = async (Model, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const results = await Model.find().skip(skip).limit(limit);
  return results;
};

/**
 *
 * @param {import("mongoose").Model} Model - Modelo de la base de datos
 * @param {*} id - Identificador del documento a buscar
 * @returns {Object} - Documento encontrado
 *
 * @description
 * Esta función se utiliza para obtener un documento específico de una base de datos
 * utilizando su identificador. Recibe el modelo de la base de datos y el identificador
 * del documento a buscar
 *
 */
const getOne = async (Model, id) => {
  const result = await Model.findById(id);
  return result;
};

module.exports = {
  create,
  getAll,
  getOne,
};
