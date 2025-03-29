const CategoryRouter = require("./CategoryRouter");
const BrandRouter = require("./BrandRouter");
const UserRouter = require("./UserRouter");
const SubCategoryRouter = require("./SubCategoryRouter");
const ProductRouter = require("./ProductRouter");
const ReviewRouter = require("./ReviewRouter");
const wishListRouter = require("./wishListRouter");
const userAddressesRouter = require("./AddressesRouter");
const AuthRouter = require("./AuthRouter");
const CouponRouter = require("./CouponRouter");
const CartRouter = require("./CartRouter");
const OrderRouter = require("./OrderRouter");

const mountRoute = (app) => {
  app.use("/api/v1/category", CategoryRouter);
  app.use("/api/v1/Brand", BrandRouter);
  app.use("/api/v1/Subcategory", SubCategoryRouter);
  app.use("/api/v1/Product", ProductRouter);
  app.use("/api/v1/User", UserRouter);
  app.use("/api/v1/review", ReviewRouter);
  app.use("/api/v1/wishList", wishListRouter);
  app.use("/api/v1/addresses", userAddressesRouter);
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/coupon", CouponRouter);
  app.use("/api/v1/cart", CartRouter);
  app.use("/api/v1/order", OrderRouter);
};

module.exports = mountRoute;
