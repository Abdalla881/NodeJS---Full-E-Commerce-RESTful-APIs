const asyncHandler = require("express-async-handler");

const USER = require("../Model/UserModel");

// #desc Add Addresses to user Addresses List
// #route post /api/v1/addresses
// #Access  privet/('user')
exports.addAddressesToAddressesList = asyncHandler(async (req, res, next) => {
  const user = await USER.findOneAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    Status: "Success",
    msg: "Address Add Successfully",
    Address: user.addresses,
  });
});

// #desc Remove Addresses from  user Addresses List
// #route delete /api/v1/addresses
// #Access  privet/('user')
exports.removeAddressesfromAddressesList = asyncHandler(
  async (req, res, next) => {
    const user = await USER.findOneAndUpdate(
      req.user._id,
      {
        $pull: { addresses: { _id: req.params.id } },
      },
      { new: true }
    );

    res.status(200).json({
      Status: "Success",
      msg: "Addresses Remove Successfully from  user Addresses List",
      Addresses: user.addresses,
    });
  }
);

// #desc Get Logged user Addresses
// #route get /api/v1/addresses
// #Access  privet/('user')
exports.getWishListLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await USER.findById(req.user._id).populate("addresses");

  res.status(200).json({
    Status: "Success",
    Result: user.addresses.length,
    data: user.addresses,
  });
});
