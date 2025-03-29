const express = require("express");
const {
  GetProductValidator,
  CreateProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/ProductValidator");

const router = express.Router();

const reviewRoute = require("./ReviewRouter");

router.use("/:productID/review", reviewRoute);

const {
  CreateProduct,
  GetProduct,
  GetProducts,
  UpdateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
} = require("../controller/ProductConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router
  .route("/")
  .get(GetProducts)
  .post(
    protect,
    AllowTo("admin", "manger"),
    uploadProductImage,
    resizeImage,
    CreateProductValidator,
    CreateProduct
  );
router
  .route("/:id")
  .get(GetProductValidator, GetProduct)
  .put(
    protect,
    AllowTo("admin", "manger"),
    uploadProductImage,
    resizeImage,
    updateProductValidator,
    UpdateProduct
  )
  .delete(
    protect,
    AllowTo("admin", "manger"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
