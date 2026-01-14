const Complain = require("../models/complain");

const createComplain = async (req, res) => {
  try {
    const { userNote, slipId } = req.body;

    if (!userNote) {
      return res.status(400).send("Complaint note is required");
    }

    const complain = await Complain.create({
      userId: req.result._id,
      slipId: slipId || null,
      userNote,
    });

    res.status(201).json(complain);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const getMyComplains = async (req, res) => {
  try {
    const complains = await Complain.find({
      userId: req.result._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(complains);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const getComplainById = async (req, res) => {
  try {
    const complain = await Complain.findById(req.params.id);
    if (!complain) return res.status(404).send("Complaint not found");

    if (complain.userId.toString() !== req.result._id.toString()) {
      return res.status(403).send("Forbidden");
    }

    res.status(200).json(complain);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const getAllComplains = async (req, res) => {
  try {
    const filter = {};

    if (req.query.unresolved === "true") {
      filter.resolved = false;
    }

    const complains = await Complain.find(filter)
      .populate("userId", "firstName emailId")
      .populate("slipId")
      .sort({ createdAt: -1 });

    res.status(200).json(complains);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const resolveComplain = async (req, res) => {
  try {
    const { clinicNote } = req.body;

    const complain = await Complain.findById(req.params.id);
    if (!complain) return res.status(404).send("Complaint not found");

    complain.clinicNote = clinicNote || complain.clinicNote;
    complain.resolved = true;
    complain.resolvedAt = new Date();

    await complain.save();

    res.status(200).json(complain);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  createComplain,
  getMyComplains,
  getComplainById,
  getAllComplains,
  resolveComplain,
};
