const express = require("express");

const {
  getUserValidator,
  CreateUserValidator,
  updateUserValidator,
  deleteUserValidator,
  ChangePasswordValidator,
  updateLoggedUserDataValidator,
  changeLoggedUserPasswordValidator,
} = require("../utils/validator/UserValidator");

const router = express.Router();
const {
  GetUsers,
  GetUser,
  CreateUser,
  UpdateUser,
  deleteUser,
  changePassword,
  uploadBrandImage,
  resizeImage,
} = require("../controller/UserConteroller");

const {
  protect,
  AllowTo,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deactivate,
} = require("../controller/AuthConteroller");

router
  .route("/")
  .get(protect, AllowTo("admin"), GetUsers)
  .post(
    protect,
    AllowTo("admin"),
    uploadBrandImage,
    resizeImage,
    CreateUserValidator,
    CreateUser
  );

//Route for logged user
router.get("/getMe", protect, getLoggedUserData, GetUser);
router.put(
  "/changeMyPassword",
  protect,
  changeLoggedUserPasswordValidator,
  changeLoggedUserPassword
);
router.put(
  "/updateMe",
  protect,
  updateLoggedUserDataValidator,
  updateLoggedUserData
);
router.delete("/deactivate", protect, deactivate);

router
  .route("/:id")
  .get(protect, AllowTo("admin"), getUserValidator, GetUser)
  .put(
    protect,
    AllowTo("admin"),
    uploadBrandImage,
    resizeImage,
    updateUserValidator,
    UpdateUser
  )
  .delete(protect, AllowTo("admin"), deleteUserValidator, deleteUser);

router.put("/ChangePassword/:id", ChangePasswordValidator, changePassword);

module.exports = router;
