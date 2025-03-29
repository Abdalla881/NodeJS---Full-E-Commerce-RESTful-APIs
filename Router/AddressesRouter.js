const express = require("express");

const router = express.Router();

const {
  addAddressesValidator,
  removeProdfromWishListValidator,
} = require("../utils/validator/userAddressesValidator");

const {
  removeAddressesfromAddressesList,
  getWishListLoggedUser,
  addAddressesToAddressesList,
} = require("../controller/userAddressesConteroller");

const { protect, AllowTo } = require("../controller/AuthConteroller");

router.use(protect, AllowTo("user"));

router
  .route("/")
  // .get(GetBrands)
  .post(addAddressesValidator, addAddressesToAddressesList)
  .get(getWishListLoggedUser);

router
  .route("/:id")
  .delete(removeProdfromWishListValidator, removeAddressesfromAddressesList);
module.exports = router;
