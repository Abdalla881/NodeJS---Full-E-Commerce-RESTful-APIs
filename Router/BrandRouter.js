const express = require("express");

const {
  getBrandValidator,
  CreateBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/BrandValidator");

const router = express.Router();
const {
  CreateBrand,
  GetBrands,
  GetBrand,
  UpdateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/BrandConteroller");

const { protect ,AllowTo } = require("../controller/AuthConteroller");


router
  .route("/")
  .get(GetBrands)
  .post(protect,AllowTo('admin','manger'),uploadBrandImage, resizeImage, CreateBrandValidator, CreateBrand);
router
  .route("/:id")
  .get(getBrandValidator, GetBrand)
  .put(protect,AllowTo('admin','manger'),uploadBrandImage, resizeImage, updateBrandValidator, UpdateBrand)
  .delete(protect,AllowTo('admin','manger'),deleteBrandValidator, deleteBrand);

module.exports = router;
