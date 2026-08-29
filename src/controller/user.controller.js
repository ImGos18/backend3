const logger = require("../config/logger");
const UserService = require("../services/users.service");
const asyncHandler = require("./../utils/asyncHandler");
const responseFormat = require("./../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const user = await UserService.create(req.body);

  logger.info(`User creado: ${user._id}`);
  responseFormat(req, res, 201, user);
});
exports.getAll = asyncHandler(async (req, res, next) => {
  const users = await UserService.getAll();
  responseFormat(req, res, 200, users);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const user = await UserService.getOne(req.params);
  responseFormat(req, res, 200, user);
});

exports.uploadUserDocument = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.body;
  const updatedUser = await UserService.addDocument(id, req.file, type);

  responseFormat(req, res, 200, updatedUser);
});
