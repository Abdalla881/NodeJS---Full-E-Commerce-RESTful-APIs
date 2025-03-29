const { check } = require("express-validator");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");
const USER = require("../../Model/UserModel");

exports.addAddressesValidator = [
  check("alias").optional(),
  check("details").notEmpty().withMessage("details is required"),
  check("phone")
    .notEmpty()
    .withMessage("Mobile phone is required")
    .isMobilePhone("ar-EG")
    .withMessage("only accept EG number"),
  check("city").notEmpty().withMessage("City is required"),
  check("postalCode").notEmpty().withMessage("postalCode is required"),

  validatorMiddelwere,
];

exports.removeProdfromWishListValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Address Id Format")
    .custom((value) =>
      USER.findOne({ "addresses._id": value }).then((Address) => {
        if (!Address) {
          return Promise.reject(new Error("No Address for this id "));
        }
        return true;
      })
    ),
  validatorMiddelwere,
];
