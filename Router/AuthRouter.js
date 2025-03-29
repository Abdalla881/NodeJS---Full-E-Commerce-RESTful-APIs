const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/AuthValidator");

const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  verifyPassword,
  resetPassword,
} = require("../controller/AuthConteroller");

router.route("/signup").post(signupValidator, signup);

router.route("/login").post(loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyPassword", verifyPassword);
router.put("/resetPassword", resetPassword);

module.exports = router;
