const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      reuired: [true, "Coupon name is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },
    expired: {
      type: Date,
      required: [true, "Coupon expired time required "],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required "],
    },
  },
  { timestamps: true }
);

const couponModel = new mongoose.model("Coupon", couponSchema);
module.exports = couponModel;
