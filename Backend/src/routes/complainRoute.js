  const express = require("express");
  const complainRouter = express.Router();

  const {
    createComplain,
    getMyComplains,
    getComplainById,
    getAllComplains,
    resolveComplain,
  } = require("../controller/userComplain");

  const userMiddleware = require("../middleware/userMiddleware");
  const adminMiddleware = require("../middleware/adminMiddleware");

  // User routes
  complainRouter.post("/create", userMiddleware, createComplain);
  complainRouter.get("/my", userMiddleware, getMyComplains);
  complainRouter.get("/:id", userMiddleware, getComplainById);

  // Admin routes
  complainRouter.get("/admin/all", adminMiddleware, getAllComplains);
  complainRouter.put("/admin/resolve/:id", adminMiddleware, resolveComplain);

  module.exports = complainRouter;
