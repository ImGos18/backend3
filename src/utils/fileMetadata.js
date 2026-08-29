const path = require("path");

function createFileMetadata(file, documentType) {
  return {
    originalName: file.originalname,
    fileName: file.filename,
    path: path.relative(process.cwd(), file.path).replaceAll("\\", "/"),
    mimeType: file.mimetype,
    size: file.size,
    type: documentType,
    uploadedAt: new Date(),
  };
}

module.exports = createFileMetadata;
