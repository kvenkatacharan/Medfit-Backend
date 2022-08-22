const express = require("express");
const {
  addReports,
  getReports,
  updateReports,
} = require("../controllers/reportsController");

const router = express.Router();
router.post("/add", addReports);
router.post("/get", getReports);
router.post("/update", updateReports);

module.exports = {
  routes: router,
};
