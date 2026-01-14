const mongoose = require("mongoose");
const { Schema } = mongoose;

const complainSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    slipId: {
      type: Schema.Types.ObjectId,
      ref: "slip",
      default: null,
    },
    userNote: {
      type: String,
      required: true,
      trim: true,
    },
    clinicNote: {
      type: String,
      trim: true,
      default: "",
    },
    resolved: {
      type: Boolean,
      default: false,
      required: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

complainSchema.index({ userId: 1, slipId: 1, resolved: 1 });

const Complain = mongoose.model("complain", complainSchema);
module.exports = Complain;
