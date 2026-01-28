const Slip = require("../models/slip");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
};

const createSlip = async (req, res) => {
  try {
    let { type, clothes, paidItems } = req.body;

    type = type || "Regular";

    // Regular slip rule: previous must be completed
    if (type === "Regular") {
      const lastRegularSlip = await Slip.findOne({
        userId: req.result._id,
        type: "Regular",
      }).sort({ createdAt: -1 });

      if (lastRegularSlip && lastRegularSlip.status !== "Completed") {
        return res
          .status(403)
          .send(
            "You can create a Regular slip only after your previous Regular slip is completed"
          );
      }

      if (!clothes) {
        return res.status(400).send("Clothes are required for Regular slip");
      }

      const total = Object.values(clothes).reduce(
        (sum, v) => sum + (Number(v) || 0),
        0
      );

      if (total === 0) {
        return res.status(400).send("Add at least one clothing item");
      }
    }

    // Paid slip validation
    if (type === "Paid") {
      if (!paidItems) {
        return res.status(400).send("Paid items are required for Paid slip");
      }

      const baseTotal =
        (paidItems.jacket || 0) +
        (paidItems.blanket || 0) +
        (paidItems.comforter || 0) +
        (paidItems.hoodie || 0) +
        (paidItems.sweater || 0);

      const customTotal = Array.isArray(paidItems.customItems)
        ? paidItems.customItems.reduce((s, i) => s + (i.qty || 0), 0)
        : 0;

      if (baseTotal + customTotal === 0) {
        return res.status(400).send("Add at least one paid item");
      }
    }

    const slip = await Slip.create({
      ...req.body,
      type,
      userId: req.result._id,
      otp: generateOTP(),
    });

    res.status(201).json(slip);
  } 
  catch (err) {
    if (err.name === "ValidationError") {
      const firstKey = Object.keys(err.errors)[0];
      const msg = err.errors[firstKey]?.message;

      // Custom wording for specific cases
      if (firstKey.includes("customItems") && firstKey.includes("name")) {
        return res.status(400).send("Item name is required");
      }

      return res.status(400).send(msg || "Validation failed");
    }

    res.status(400).send(err.message);
  }
};


const getQueueCount = async (req, res) => {
  try {
    const count = await Slip.countDocuments({
      status: "Slip-Created",
    });

    res.json({
      status: "ok",
      slipCreatedCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch queue count" });
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
      if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).send(messages.join(", "));
    }
    res.status(400).send(err.message);
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
        .populate("userId", "firstName emailId bagNo")
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

    const { clinicNote } = req.body || {};

    slip.status = "At Clinic";
    if (clinicNote) slip.clinicNote = clinicNote;

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
    slip.completedAt = new Date();
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

    if (slip.status === "At Clinic" || slip.status === "Ready for Pickup") {
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

// Admin – Reject (Delete) Slip
const adminRejectSlip = async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).send("Slip not found");

    if (slip.status !== "Slip-Created") {
      return res.status(400).send("Only Slip-Created slips can be rejected");
    }

    await Slip.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Slip rejected and deleted" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = {
  createSlip,
  getQueueCount,
  getMySlips,
  getSlipById,
  updateSlip,
  getAllSlips,
  adminApproveSlip,
  markReadyForPickup,
  completeSlipWithOtp,
  deleteSlip,
  adminRejectSlip,
};

