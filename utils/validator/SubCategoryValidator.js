const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");

exports.CreateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2 })
    .withMessage("Too short Category name")
    .isLength({ max: 32 })
    .withMessage("Too Long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Category Id"),
  validatorMiddelwere,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddelwere,
];
