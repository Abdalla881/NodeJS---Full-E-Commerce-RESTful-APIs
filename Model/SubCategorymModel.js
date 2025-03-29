/* eslint-disable new-cap */
const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      uniqe: true,
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too Long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: [true, "SubCategory Must Belong to main Category "],
    },
  },
  { timestamps: true }
);

const SubCategorymodel = new mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategorymodel;
