const express = require("express");

const {
  deleteCouponValidator,
  updateCouponValidator,
  CreateCoupomValidator,
  getCouponValidator,
} = require("../utils/validator/CouponValidator");

const router = express.Router();
const {
  GetCoupons,
  GetCoupon,
  CreateCoupon,
  UpdateCoupon,
  deleteCoupon,
} = require("../controller/CouponConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router
  .route("/")
  .get(GetCoupons)
  .post(
    protect,
    AllowTo("admin", "manger"),
    CreateCoupomValidator,
    CreateCoupon
  );
router
  .route("/:id")
  .get(getCouponValidator, GetCoupon)
  .put(protect, AllowTo("admin", "manger"), updateCouponValidator, UpdateCoupon)
  .delete(
    protect,
    AllowTo("admin", "manger"),
    deleteCouponValidator,
    deleteCoupon
  );

module.exports = router;
