const { default: slugify } = require("slugify");

const { check } = require("express-validator");
const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddelwere,
];

exports.CreateCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Too short Category name")
    .isLength({ max: 32 })
    .withMessage("Too Long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddelwere,
];
