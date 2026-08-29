const router = require("express").Router();
const upload = require("./../middlewares/upload.middleware");
const uploadUserDocuments = "";

router.post("/:id/documents", upload.single("document"), uploadUserDocuments);

module.exports = router;
