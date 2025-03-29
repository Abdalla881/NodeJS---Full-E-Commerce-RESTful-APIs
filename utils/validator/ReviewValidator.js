const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const REVIEW = require("../../Model/ReviewModel");
const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id Format"),
  validatorMiddelwere,
];

exports.CreateReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Must be Between 1 and 5 "),

  check("user").isMongoId().withMessage("Invalid user Id Format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product Id Format")
    .custom((val, { req }) =>
      REVIEW.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),

  validatorMiddelwere,
];

exports.updatereviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) =>
      REVIEW.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("No revieew for This ID"));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),

  validatorMiddelwere,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return REVIEW.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("No revieew for This ID"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddelwere,
];
