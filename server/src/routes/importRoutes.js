const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");
const { importData } = require("../controllers/importController");

router.post("/", upload.single("file"), importData);

module.exports = router;
