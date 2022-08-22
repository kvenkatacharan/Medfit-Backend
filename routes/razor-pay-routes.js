const express = require("express");
const { createRazorPayOrder } = require("../controllers/razorPayController");

const router = express.Router();
router.post("/createRazorPayOrder", createRazorPayOrder);

module.exports = {
  routes: router,
};
