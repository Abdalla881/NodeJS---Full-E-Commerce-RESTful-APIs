const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  CreateReviewValidator,
  updatereviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/ReviewValidator");

const {
  CreateReview,
  GetReviews,
  GetReview,
  UpdateReview,
  deleteReview,
  FilterObject,
  setprodctIdAndUserToBody,
} = require("../controller/ReviewsConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router
  .route("/")
  .get(FilterObject, GetReviews)
  .post(
    protect,
    AllowTo("user"),
    setprodctIdAndUserToBody,
    CreateReviewValidator,
    CreateReview
  );
router
  .route("/:id")
  .get(GetReview)
  .put(protect, AllowTo("user"), updatereviewValidator, UpdateReview)
  .delete(
    protect,
    AllowTo("user", "admin", "manger"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
