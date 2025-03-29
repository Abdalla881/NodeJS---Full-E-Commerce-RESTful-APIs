const express = require("express");

const router = express.Router();
const {
  createCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartQuantity,
  applyCoupon,
} = require("../controller/CartConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router.use(protect, AllowTo("user"));

router.route("/").post(createCart).get(getLoggedUserCart).delete(clearCart);

router.route("/applyCoupon").put(applyCoupon);

router.route("/:cartId").put(updateCartQuantity).delete(removeSpecificCartItem);

module.exports = router;
