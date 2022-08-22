const express = require("express");
const { fileUpload } = require("../controllers/fileuploadController");

const router = express.Router();
router.post("/", fileUpload);

module.exports = {
  routes: router,
};
