const asyncHandler = require("express-async-handler");

const USER = require("../Model/UserModel");

// #desc Add product to WishList
// #route post /api/v1/wishlist
// #Access  privet/('user')
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await USER.findOneAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    Status: "Success",
    msg: "Product Add Successfully to your wishList",
    wishList: user.wishList,
  });
});

// #desc Remove product from  WishList
// #route delete /api/v1/wishlist
// #Access  privet/('user')
exports.removeProductfromWishList = asyncHandler(async (req, res, next) => {
  const user = await USER.findOneAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({
    Status: "Success",
    msg: "Product Remove Successfully to your wishList",
    wishList: user.wishList,
  });
});

// #desc Get Logged user wishList
// #route Get /api/v1/wishlist
// #Access  privet/('user')
exports.getWishListLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await USER.findById(req.user._id).populate("wishList");

  res.status(200).json({
    Status: "Success",
    Result: user.wishList.length,
    data: user.wishList,
  });
});
