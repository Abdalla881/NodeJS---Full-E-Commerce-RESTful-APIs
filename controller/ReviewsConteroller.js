const REVIEW = require("../Model/ReviewModel");

const factory = require("./HandlerFactory");

//Nisted Route
exports.FilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productID) {
    filterObject = { product: req.params.productID };
    req.filterObject = filterObject;
    next();
  }
};

exports.setprodctIdAndUserToBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productID;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

// #desc Get All reviews
// #route Get /api/v1/review
// #Access  Public
exports.GetReviews = factory.GetAll(REVIEW);

// #desc Get Specific review by id
// #route Get /api/v1/review/id:
// #Access  Public
exports.GetReview = factory.GetOne(REVIEW);

// #desc create review
// #route Post /api/v1/review
// #Access  privet/('user')
exports.CreateReview = factory.createOne(REVIEW);

// #desc Update Specific review
// #route PUT /api/v1/review/:id
// #Access  privet/('user')
exports.UpdateReview = factory.updateOne(REVIEW);

// #desc Delete Specific review
// #route DELETE /api/v1/review/:id
// #Access  privet/('user','admin','manger')

exports.deleteReview = factory.deleteOne(REVIEW);
