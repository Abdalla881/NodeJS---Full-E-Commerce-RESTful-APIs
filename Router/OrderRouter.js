const express = require("express");

const router = express.Router();
const {
  createCashOrder,
  GetAllUserOrder,
  GetSpecifcUserOrder,
  filterObject,
  updateOrderPaidStatus,
  updateOrderDeliverStatus,
  checkoutSession,
} = require("../controller/OrderConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router
  .route("/checkout-Session/:cartId")
  .get(protect, AllowTo("user"), checkoutSession);

router
  .route("/")
  .get(protect, AllowTo("user", "admin"), filterObject, GetAllUserOrder);

router.route("/:cartId").post(protect, AllowTo("user"), createCashOrder);
router.route("/:id").get(protect, AllowTo("user"), GetSpecifcUserOrder);

router
  .route("/:id/pay")
  .put(protect, AllowTo("manger", "admin"), updateOrderPaidStatus);
router
  .route("/:id/deliver")
  .put(protect, AllowTo("manger", "admin"), updateOrderDeliverStatus);

module.exports = router;
