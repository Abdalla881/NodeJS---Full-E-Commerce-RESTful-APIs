/* eslint-disable new-cap */
const mongoose = require("mongoose");

const categoryScema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short Category name"],
      maxlength: [32, "Too long Category name"],
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
    const imageUrl = `${process.env.BASEURL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categoryScema.post("init", (doc) => {
  IMAGEURL(doc);
});
categoryScema.post("save", (doc) => {
  IMAGEURL(doc);
});

const Categorymodel = new mongoose.model("Category", categoryScema);
module.exports = Categorymodel;
