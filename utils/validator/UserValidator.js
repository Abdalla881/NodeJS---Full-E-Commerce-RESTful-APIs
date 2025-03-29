const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");

const validatorMiddelwere = require("../../middelweres/validatorMiddelwere");
const USER = require("../../Model/UserModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddelwere,
];

exports.CreateUserValidator = [
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
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid Email Adress")
    .custom((email) =>
      USER.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password Must be at least 6 character")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmtion) {
        throw new Error("password Confirmtion IS incorrect");
      }
      return true;
    }),
  check("passwordConfirmtion")
    .notEmpty()
    .withMessage("Password confirmtion is Required")
    .isLength({ min: 6 })
    .withMessage("Password Must be at least 6 character"),

  check("profileImg").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("onlu accept Ey and SA number"),

  validatorMiddelwere,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Adress")
    .custom((email) =>
      USER.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("profileImg").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("onlu accept Ey and SA number"),
  validatorMiddelwere,
];

exports.ChangePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("CurrentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("passwordConfirmtion")
    .notEmpty()
    .withMessage("password Confirmtion is required"),

  check("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(async (password, { req }) => {
      const user = await USER.findById(req.params.id);
      if (!user) {
        throw new Error("No User For This Id ");
      }
      const isCurrentPassword = await bcrypt.compare(
        req.body.CurrentPassword,
        user.password
      );
      if (!isCurrentPassword) {
        throw new Error("Current Password Incorrect");
      }

      if (req.body.passwordConfirmtion !== password) {
        throw new Error("password Confirmtion Incorrect");
      }
    }),
  validatorMiddelwere,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddelwere,
];

exports.updateLoggedUserDataValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Adress")
    .custom((email) =>
      USER.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("profileImg").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("onlu accept Ey and SA number"),
  validatorMiddelwere,
];

exports.changeLoggedUserPasswordValidator = [
  check("CurrentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("passwordConfirmtion")
    .notEmpty()
    .withMessage("password Confirmtion is required"),

  check("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(async (password, { req }) => {
      const user = await USER.findById(req.user._id);
      if (!user) {
        throw new Error("No User For This Id ");
      }
      const isCurrentPassword = await bcrypt.compare(
        req.body.CurrentPassword,
        user.password
      );
      if (!isCurrentPassword) {
        throw new Error("Current Password Incorrect");
      }

      if (req.body.passwordConfirmtion !== password) {
        throw new Error("password Confirmtion Incorrect");
      }
    }),
  validatorMiddelwere,
];
