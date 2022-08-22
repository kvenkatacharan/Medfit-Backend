const express = require("express");
const { createZoomMeetinglink } = require("../controllers/zoomController");

const router = express.Router();
router.post("/createMeeting", createZoomMeetinglink);

module.exports = {
  routes: router,
};
