const express = require("express");
const {
  bookAppointment,
  viewAppointment,
  viewAllAppointments,
  cancelAppointment,
  modifyAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/view", viewAppointment);
router.get("/doctor", viewAllAppointments);
router.delete("/cancel", cancelAppointment);
router.put("/modify", modifyAppointment);

module.exports = router;
