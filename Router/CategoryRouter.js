const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/categories" });

const {
  getCategoryValidator,
  CreateCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/CategoryValidator");

const router = express.Router();
const {
  CreatCategory,
  GetCategoryies,
  GetCategory,
  UpdateCategory,
  deleteCategory,
  uploadCateoryImage,
  resizeImage,
} = require("../controller/CategoryConteroller");

const { protect ,AllowTo } = require("../controller/AuthConteroller");

const SubCategoryRouter = require("./SubCategoryRouter");

router.use("/:categoryId/Subcategory", SubCategoryRouter);

router
  .route("/")
  .get(GetCategoryies)
  .post(
    protect,
    AllowTo('admin','manger'),
    uploadCateoryImage,
    resizeImage,
    CreateCategoryValidator,
    CreatCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, GetCategory)
  .put(protect,AllowTo('admin','manger'),uploadCateoryImage, resizeImage, updateCategoryValidator, UpdateCategory)
  .delete(protect,AllowTo('admin','manger'),deleteCategoryValidator, deleteCategory);

module.exports = router;
