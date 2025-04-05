const { v4: uuidv4 } = require("uuid");
const patientSchema = require("../utils/patient.validation");
const Patient = require("../models/patient.model");

exports.addPatient = (req, res) => {
  try {
    const validated = patientSchema.parse(req.body);
    const patient = new Patient(uuidv4(), validated.name, validated.triageLevel, Date.now());
    req.patientQueue.enqueue(patient);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

exports.getQueue = (req, res) => {
  res.status(200).json(req.patientQueue.getAll());
};

exports.treatPatient = (req, res) => {
  const queue = req.patientQueue.getAll();
  const treatingNow = queue.filter(p => p.status === "being treated");

  if (treatingNow.length >= 3) {
    req.patientQueue.io.emit("treatment-limit-reached", {
      message: " Treatment limit reached. Max 3 patients can be treated at once.",
    });

    return res.status(403).json({
      message: "Treatment limit reached. Wait for a patient to be discharged.",
    });
  }

  const nextPatient = queue.find(p => p.status === "waiting");

  if (!nextPatient) {
    return res.status(404).json({ message: "No waiting patients available" });
  }

  nextPatient.status = "being treated";
  req.patientQueue.sortQueue();

  req.patientQueue.io.emit("patient-treated", nextPatient);
  res.status(200).json(nextPatient);
};




exports.dischargePatient = (req, res) => {
  const { id } = req.params;
  const patient = req.patientQueue.queue.find(p => p.id === id);

  if (!patient || patient.status !== "being treated") {
    return res.status(404).json({ message: "Patient not found or not under treatment" });
  }

  patient.status = "discharged";
  req.patientQueue.sortQueue();

  req.patientQueue.io.emit("patient-discharged", patient);
  res.status(200).json({ message: "Patient discharged", patient });
};

