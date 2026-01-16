const Slip = require("../models/slip");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
};

const createSlip = async (req, res) => {
  try {
    const { type, clothes, paidItems } = req.body;

    // Regular slip rule: previous must be completed
    if (type === "Regular") {
      const lastSlip = await Slip.findOne({ userId: req.result._id })
        .sort({ createdAt: -1 });

      if (lastSlip && lastSlip.status !== "Completed") {
        return res
          .status(403)
          .send(
            "You can create a Regular slip only after your previous slip is completed"
          );
      }

      if (!clothes) {
        return res.status(400).send("Clothes are required for Regular slip");
      }
    }

    // Paid slip validation
    if (type === "Paid" && !paidItems) {
      return res.status(400).send("Paid items are required for Paid slip");
    }

    const slip = await Slip.create({
      ...req.body,
      userId: req.result._id,
      otp: generateOTP(),
    });

    res.status(201).json(slip);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};



const getMySlips = async (req, res) => {
  try {
    const slips = await Slip.find({ userId: req.result._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(slips);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const getSlipById = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (
      req.result.role === "user" &&
      slip.userId.toString() !== req.result._id.toString()
    ) {
      return res.status(403).send("Forbidden");
    }

    res.status(200).json(slip);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};



const updateSlip = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "Slip-Created") {
      return res.status(403).send("Slip can no longer be edited");
    }

    if (slip.userId.toString() !== req.result._id.toString()) {
      return res.status(403).send("Forbidden");
    }

    // Prevent switching type after creation
    if (req.body.type && req.body.type !== slip.type) {
      return res.status(400).send("Slip type cannot be changed");
    }

    // Prevent mixing fields
    if (slip.type === "Regular" && req.body.paidItems) {
      return res.status(400).send("Paid items not allowed in Regular slip");
    }

    if (slip.type === "Paid" && req.body.clothes) {
      return res.status(400).send("Clothes not allowed in Paid slip");
    }

    Object.assign(slip, req.body);
    await slip.save();

    res.status(200).json(slip);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
// Admin: Get all slips (with optional filters)
const getAllSlips = async (req, res) => {
  try {
    const { status, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;

    const [slips, total] = await Promise.all([
      Slip.find(filter)
        .populate("userId", "firstName emailId")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Slip.countDocuments(filter),
    ]);

    res.status(200).json({
      data: slips,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const adminApproveSlip = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "Slip-Created") {
      return res.status(400).send("Slip already processed");
    }

    slip.status = "At Clinic";
    if (req.body.clinicNote) slip.clinicNote = req.body.clinicNote;

    await slip.save();
    res.status(200).json(slip);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const markReadyForPickup = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "At Clinic") {
      return res.status(400).send("Slip is not at clinic");
    }

    slip.status = "Ready for Pickup";
    await slip.save();

    res.status(200).json(slip);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const completeSlipWithOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const slip = await Slip.findById(req.params.id);

    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "Ready for Pickup") {
      return res.status(400).send("Slip is not ready for pickup");
    }

    if (slip.otpUsed) {
      return res.status(400).send("OTP already used");
    }

    if (!otp || slip.otp !== String(otp)) {
      return res.status(400).send("Invalid OTP");
    }

    slip.otpUsed = true;
    slip.status = "Completed";
    await slip.save();

    res.status(200).send("Laundry handed over successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};


// User can delete ONLY when Slip-Created
const deleteSlip = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "Slip-Created") {
      return res.status(403).send("Cannot delete approved slip");
    }

    if (slip.userId.toString() !== req.result._id.toString()) {
      return res.status(403).send("Forbidden");
    }

    await Slip.findByIdAndDelete(req.params.id);
    res.status(200).send("Slip deleted");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = {
  createSlip,
  getMySlips,
  getSlipById,
  updateSlip,
  getAllSlips,
  adminApproveSlip,
  markReadyForPickup,
  completeSlipWithOtp,
  deleteSlip,
};

