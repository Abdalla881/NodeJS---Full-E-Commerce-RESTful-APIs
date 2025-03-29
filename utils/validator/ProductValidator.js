const { check } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");
const CATEGORY = require("../../Model/CategoryModel");
const SUBCATEGORIES = require("../../Model/SubCategorymModel");

exports.CreateProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product is required")
    .isLength({ min: 3 })
    .withMessage("Too short Product name")
    .isLength({ max: 200 })
    .withMessage("Too Long Product name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 2 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too Long Category name"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a Number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a Number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a Number")
    .isLength({ max: 32 })
    .withMessage("Too Long Product price"),

  check("PriceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product PriceAfterDiscount must be a Number")
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("PriceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Product Colors Must be array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("image")
    .optional()
    .isArray()
    .withMessage("Product image Must be array of string"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid ID Formate")
    .custom((categoryID) =>
      CATEGORY.findById(categoryID).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Cayegory for this iD ${categoryID}`)
          );
        }
      })
    ),

  check("SubCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID Formate")
    .custom((SubCategoriesId) =>
      SUBCATEGORIES.find({ _id: { $exists: true, $in: SubCategoriesId } }).then(
        (result) => {
          if (result < 1 || result.length !== SubCategoriesId.length) {
            return Promise.reject(new Error(`Invalid SubCateories IDs`));
          }
        }
      )
    )
    .custom((SubCategoriesId, { req }) =>
      SUBCATEGORIES.find({ category: req.body.category }).then(
        (subcategory) => {
          const AllsubCategoryDB = [];
          subcategory.forEach((sub) => {
            AllsubCategoryDB.push(sub._id.toString());
          });

          const checker = SubCategoriesId.every((sub) =>
            AllsubCategoryDB.includes(sub)
          );
          if (!checker) {
            return Promise.reject(
              new Error(`Subcategories Not Belong to Category`)
            );
          }
        }
      )
    ),

  check("Brand").optional().isMongoId().withMessage("Invalid ID Formate"),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingAverage must be a Number")
    .isLength({ min: 1 })
    .withMessage("Rating Must Be Above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating Must Be Below or equal 5"),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingQuantity must be a Number"),

  validatorMiddelwere,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddelwere,
];

exports.GetProductValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddelwere,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddelwere,
];
