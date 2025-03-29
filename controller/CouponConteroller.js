const COUPON = require("../Model/CouponModel");

const factory = require("./HandlerFactory");

// #desc Get All Coupon
// #route Get /api/v1/coupon
// #Access  privet/("admin"."manger")
exports.GetCoupons = factory.GetAll(COUPON);

// #desc Get Specific Coupon by id
// #route Get /api/v1/coupon/id:
// #Access  privet/("admin"."manger")
exports.GetCoupon = factory.GetOne(COUPON);

// #desc create Coupon
// #route Post /api/v1/Coupon
// #Access  privet/('admin','manger')
exports.CreateCoupon = factory.createOne(COUPON);

// #desc Update Specific Coupon
// #route PUT /api/v1/coupon/:id
// #Access  privet/('admin','manger')
exports.UpdateCoupon = factory.updateOne(COUPON);

// #desc Delete Specific Coupon
// #route DELETE /api/v1/coupon/:id
// #Access  privet/('admin','manger')

exports.deleteCoupon = factory.deleteOne(COUPON);
