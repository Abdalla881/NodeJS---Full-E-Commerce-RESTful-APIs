const { check } = require("express-validator");

const COUPON = require("../../Model/CouponModel");
const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddelwere,
];

exports.CreateCoupomValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon is required")
    .isLength({ min: 4 })
    .withMessage("Too short Coupon name")
    .isLength({ max: 32 })
    .withMessage("Too Long Coupon name")
    .custom((val) =>
      COUPON.findOne({ name: val }).then((coupon) => {
        if (coupon) {
          return Promise.reject(new Error("The Coupon name already exist"));
        }
        return true;
      })
    ),

  validatorMiddelwere,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  check("name")
    .optional()
    .custom((val) =>
      COUPON.findOne({ name: val }).then((coupon) => {
        if (coupon) {
          return Promise.reject(new Error("The Coupon name already exist"));
        }
        return true;
      })
    ),
  validatorMiddelwere,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddelwere,
];
