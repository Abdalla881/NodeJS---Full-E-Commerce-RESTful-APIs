const { default: mongoose } = require("mongoose");
const PRODUCT = require("./ProductModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      Min: [1, "Min rating value is 1 "],
      MAX: [1, "Max rating value is 5 "],
      required: [true, "Review rating required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must Belong to Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAvgRatingAndQuantity = async function (ProductId) {
  const result = await this.aggregate([
    {
      $match: {
        product: ProductId,
      },
    },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await PRODUCT.findOneAndUpdate(ProductId, {
      ratingAverage: result[0].avgRating,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await PRODUCT.findOneAndUpdate(ProductId, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingAndQuantity(this.product);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });

  next();
});

const ReviewModel = new mongoose.model("Review", reviewSchema);
module.exports = ReviewModel;
