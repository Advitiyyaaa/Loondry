const express = require("express");
const slipRouter = express.Router();

const {
  createSlip,
  getMySlips,
  getSlipById,
  updateSlip,
  deleteSlip,
  getAllSlips,
  adminApproveSlip,
  completeSlipWithOtp,
  markReadyForPickup,
} = require("../controller/userSlip");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User routes
slipRouter.post("/create", userMiddleware, createSlip);
slipRouter.get("/my", userMiddleware, getMySlips);
slipRouter.get("/:id", userMiddleware, getSlipById);
slipRouter.put("/update/:id", userMiddleware, updateSlip);
slipRouter.delete("/delete/:id", userMiddleware, deleteSlip);

// Admin routes
slipRouter.put("/admin/approve/:id", adminMiddleware, adminApproveSlip);
slipRouter.put("/admin/ready/:id", adminMiddleware, markReadyForPickup);
slipRouter.put("/admin/complete/:id", adminMiddleware, completeSlipWithOtp);
slipRouter.get("/admin/all", adminMiddleware, getAllSlips);


module.exports = slipRouter;
