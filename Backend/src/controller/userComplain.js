const Complain = require("../models/complain");
const Slip = require("../models/slip");

const createComplain = async (req, res) => {
  try {
    const { userNote, slipId } = req.body;

    if (!userNote) {
      return res.status(400).send("Complaint note is required");
    }

    if (slipId) {
      const slip = await Slip.findById(slipId);

      if (!slip) {
        return res.status(404).send("Slip not found");
      }

      if (slip.userId.toString() !== req.result._id.toString()) {
        return res.status(403).send("Forbidden");
      }

      if (slip.status !== "Completed" || !slip.completedAt) {
        return res
          .status(400)
          .send("Complaints can only be raised for completed slips");
      }

      const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
      const age = Date.now() - new Date(slip.completedAt).getTime();

      if (age > TWO_DAYS) {
        return res
          .status(403)
          .send("Complaints can only be raised within 2 days of completion");
      }

      const existing = await Complain.findOne({
        userId: req.result._id,
        slipId,
        resolved: false,
      });

      if (existing) {
        return res
          .status(403)
          .send("You already have an active complaint for this slip");
      }
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
