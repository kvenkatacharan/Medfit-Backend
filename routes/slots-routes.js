const express = require("express");
const {
  addAvailableSlots,
  getAllAvailableSlots,
  getAvailableSlots,
  updateAvailableSlots,
  deleteAvailableSlots,
  addBooking,
  getBooking,
  updateBooking,
  nextSevenDaysSlots,
} = require("../controllers/slotsController");

const router = express.Router();
router.post("/", addAvailableSlots);
router.get("/", getAllAvailableSlots);
router.post("/getSlots/", getAvailableSlots);
router.put("/:id", updateAvailableSlots);
// router.delete('/:id', deleteStudent);
router.post("/booking/", addBooking);
router.post("/bookingDetails", getBooking);
router.post("/updateBooking", updateBooking);
router.post("/nextSevenDaysSlots", nextSevenDaysSlots);
module.exports = {
  routes: router,
};
