const mongoose = require("mongoose");
const { Schema } = mongoose;

const paidClothesSchema = new Schema(
  {
    jacket: { type: Number, default: 0 },
    blanket: { type: Number, default: 0 },
    comforter: { type: Number, default: 0 },
    hoodie: { type: Number, default: 0 },
    sweater: { type: Number, default: 0 },

    customItems: [
      {
        name: { type: String, trim: true, required: true },
        qty: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  { _id: false }
);


const clothesSchema = new Schema(
  {
    kurta: { type: Number, default: 0 },
    pajama: { type: Number, default: 0 },
    shirt: { type: Number, default: 0 },
    tshirt: { type: Number, default: 0 },
    pant: { type: Number, default: 0 },
    lower: { type: Number, default: 0 },
    shorts: { type: Number, default: 0 },
    bedsheet: { type: Number, default: 0 },
    pillowCover: { type: Number, default: 0 },
    towel: { type: Number, default: 0 },
    duppata: { type: Number, default: 0 },

    underGarments: { type: Number, default: 0 },
    socks: { type: Number, default: 0 },
    hankey: { type: Number, default: 0 },
  },
  { _id: false }
);

const slipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    type: {
      type: String,
      enum: ["Regular", "Paid"],
      default: "Regular",
      required: true,
    },

    status: {
      type: String,
      enum: ["Slip-Created", "At Clinic", "Ready for Pickup", "Completed"],
      default: "Slip-Created",
      required: true,
    },

    // Regular slip clothes
    clothes: {
      type: clothesSchema,
      required: function () {
        return this.type === "Regular";
      },
      validate: {
        validator: function (v) {
          if (this.type === "Paid") return true;

          const group1 =
            v.kurta +
            v.pajama +
            v.shirt +
            v.tshirt +
            v.pant +
            v.lower +
            v.shorts +
            v.bedsheet +
            v.pillowCover +
            v.towel +
            v.duppata;

          const group2 = v.underGarments + v.socks + v.hankey;

          return group1 <= 10 && group2 <= 5;
        },
        message: "Outer clothes should not be more than 10 and inner clothes should not be more than 5",
      },
    },

    // Paid slip items
    paidItems: {
      type: paidClothesSchema,
      required: function () {
        return this.type === "Paid";
      },
      validate: {
        validator: function (v) {
          if (this.type === "Regular") return true;

          const baseTotal =
            (v.jacket || 0) +
            (v.blanket || 0) +
            (v.comforter || 0) +
            (v.hoodie || 0) +
            (v.sweater || 0);

          const customTotal = Array.isArray(v.customItems)
            ? v.customItems.reduce((sum, item) => sum + (item.qty || 0), 0)
            : 0;

          return baseTotal + customTotal <= 5;
        },
        message: "Total paid items (including custom) should not be more than 5",
      },
    },

    userNote: { type: String, trim: true },
    clinicNote: { type: String, trim: true },
    otp: {
      type: String,
      required: true,
    },
    otpUsed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

const Slip = mongoose.model("slip", slipSchema);
module.exports = Slip;
