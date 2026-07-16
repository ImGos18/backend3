const user = require("../models/user");
const UserService = require("../services/users.service");
const fillUserData = require("./../../mocks/userMocks");
const asyncHandler = require("./../utils/asyncHandler");
const responseFormat = require("./../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const user = await UserService.create(req.body);

  console.log("User creado:", user._id);
  responseFormat(req, res, 201, user);
});
exports.getAll = asyncHandler(async (req, res, next) => {
  const users = await UserService.getAll();
  responseFormat(req, res, 200, users);
});

exports.getOne = asyncHandler(async (req, res, nex) => {
  const user = await UserService.getOne(req.params);
  responseFormat(req, res, 200, user);
});
