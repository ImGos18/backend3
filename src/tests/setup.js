process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");
const connectDB = require("../db");

let trackedDocuments;
let trackedFiles;

global.trackTestDocument = (Model, id) => {
  if (!id) return;

  const modelDocuments = trackedDocuments.get(Model) || new Set();
  modelDocuments.add(id.toString());
  trackedDocuments.set(Model, modelDocuments);
};

global.trackTestFile = (filePath) => {
  if (!filePath) return;

  const uploadsDirectory = path.resolve(process.cwd(), "uploads");
  const resolvedFile = path.resolve(filePath);
  if (resolvedFile.startsWith(`${uploadsDirectory}${path.sep}`)) {
    trackedFiles.add(resolvedFile);
  }
};

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(20000);
    await connectDB();
  },

  beforeEach() {
    trackedDocuments = new Map();
    trackedFiles = new Set();
  },

  async afterEach() {
    const cleanup = [...trackedDocuments.entries()].map(([Model, ids]) =>
      Model.deleteMany({ _id: { $in: [...ids] } }),
    );

    await Promise.all(cleanup);
    await Promise.all(
      [...trackedFiles].map((filePath) => fs.rm(filePath, { force: true })),
    );
  },

  async afterAll() {
    this.timeout(20000);
    await mongoose.disconnect();
  },
};
