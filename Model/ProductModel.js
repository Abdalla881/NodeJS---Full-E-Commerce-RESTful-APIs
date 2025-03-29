const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Product name is Required"],
      minLength: [3, "Too short Product name"],
      maxlength: [100, "Too long Product name"],
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: [true, "Product description is Required"],
      minLength: [2, "Too short Product description"],
    },
    quantity: {
      type: Number,
      require: [true, "Product quantity is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "Product peice is Required"],
      trim: true,
      max: [200000, "Too long Product price"],
    },
    PriceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      require: [true, "Product imageCover is Required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: [true, "Product category is Required"],
    },
    SubCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    Brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating Must Be Above or equal 1"],
      max: [5, "Rating Must Be Below or equal 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });

  next();
});

const IMAGEURL = (doc) => {
  const images = [];
  if (doc.images) {
    doc.images.forEach((img) => {
      const imageUrl = `${process.env.BASEURL}/products/${img}`;
      images.push(imageUrl);
    });
    doc.images = images;
  }
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASEURL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
};

ProductSchema.post("init", (doc) => {
  IMAGEURL(doc);
});
ProductSchema.post("save", (doc) => {
  IMAGEURL(doc);
});

// eslint-disable-next-line new-cap
const ProductModel = new mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
