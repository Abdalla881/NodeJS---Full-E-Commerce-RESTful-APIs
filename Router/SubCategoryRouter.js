const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  CreateSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/SubCategoryValidator");

const {
  CreatSubCategory,
  GetSubCategoryies,
  GetSubCategory,
  UpdateSubCategory,
  deleteSubCategory,
  setCtegoryIdToBody,
  FilterObject,
} = require("../controller/SubCategoryConteroller");

const { protect ,AllowTo } = require("../controller/AuthConteroller");


router
  .route("/")
  .get(FilterObject, GetSubCategoryies)
  .post(protect,AllowTo('admin','manger'),setCtegoryIdToBody, CreateSubCategoryValidator, CreatSubCategory);

router
  .route("/:id")
  .get(GetSubCategory)
  .put(protect,AllowTo('admin','manger'),updateSubCategoryValidator, UpdateSubCategory)
  .delete(protect,AllowTo('admin','manger'),deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
