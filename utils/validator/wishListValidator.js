const { check } = require("express-validator");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");
const PRODUCT = require("../../Model/ProductModel");

// exports.getUserValidator = [
//   check("id").isMongoId().withMessage("Invalid Brand Id Format"),
//   validatorMiddelwere,
// ];

exports.AddProdToWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Brand Id Format")
    .custom((value) =>
      PRODUCT.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No product for this id "));
        }
        return true;
      })
    ),

  validatorMiddelwere,
];

exports.removeProdfromWishListValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product Id Format")
    .custom((value) =>
      PRODUCT.findById(value).then((product) => {
        if (!product) {
          return Promise.reject(new Error("No product for this id "));
        }
        return true;
      })
    ),
  validatorMiddelwere,
];
