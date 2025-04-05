const express = require("express");
const router = express.Router();
const {
  addPatient,
  getQueue,
  treatPatient,
  dischargePatient,
} = require("../controllers/patient.controller");

router.post("/", addPatient);
router.get("/", getQueue);
router.put("/treat", treatPatient);
router.delete("/discharge/:id", dischargePatient);

module.exports = router;
