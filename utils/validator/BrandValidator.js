const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddelwere,
];

exports.CreateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too Long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddelwere,
];
