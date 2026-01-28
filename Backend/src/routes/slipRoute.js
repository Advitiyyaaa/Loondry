const express = require("express");
const slipRouter = express.Router();

const {
  createSlip,
  getQueueCount,
  getMySlips,
  getSlipById,
  updateSlip,
  deleteSlip,
  getAllSlips,
  adminApproveSlip,
  completeSlipWithOtp,
  markReadyForPickup,
  adminRejectSlip,
} = require("../controller/userSlip");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User routes
slipRouter.post("/create", userMiddleware, createSlip);
slipRouter.get("/queue-count", getQueueCount);
slipRouter.get("/my", userMiddleware, getMySlips);
slipRouter.get("/:id", userMiddleware, getSlipById);
slipRouter.put("/update/:id", userMiddleware, updateSlip);
slipRouter.delete("/delete/:id", userMiddleware, deleteSlip);

// Admin routes
slipRouter.get("/admin/all", adminMiddleware, getAllSlips);
slipRouter.put("/admin/approve/:id", adminMiddleware, adminApproveSlip);
slipRouter.put("/admin/ready/:id", adminMiddleware, markReadyForPickup);
slipRouter.put("/admin/complete/:id", adminMiddleware, completeSlipWithOtp);
slipRouter.delete("/admin/reject/:id", adminMiddleware, adminRejectSlip);


module.exports = slipRouter;
