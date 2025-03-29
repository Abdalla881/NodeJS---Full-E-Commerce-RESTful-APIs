/* eslint-disable new-cap */
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand must be unique"],
      minLength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const IMAGEURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASEURL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", (doc) => {
  IMAGEURL(doc);
});
BrandSchema.post("save", (doc) => {
  IMAGEURL(doc);
});

const Brandmodel = new mongoose.model("Brand", BrandSchema);
module.exports = Brandmodel;
