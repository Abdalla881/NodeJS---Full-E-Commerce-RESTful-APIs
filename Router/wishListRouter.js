const express = require("express");

const router = express.Router();

const {
  AddProdToWishListValidator,
  removeProdfromWishListValidator,
} = require("../utils/validator/wishListValidator");

const {
  addProductToWishList,
  removeProductfromWishList,
  getWishListLoggedUser,
} = require("../controller/wishListConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router.use(protect, AllowTo("user"));

router
  .route("/")
  // .get(GetBrands)
  .post(AddProdToWishListValidator, addProductToWishList)
  .get(getWishListLoggedUser);

router
  .route("/:id")
  .delete(removeProdfromWishListValidator, removeProductfromWishList);
module.exports = router;
