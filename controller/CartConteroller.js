const asyncHandler = require("express-async-handler");

const CART = require("../Model/CartModel");
const PRODUCT = require("../Model/ProductModel");
const COUPON = require("../Model/CouponModel");
const AppError = require("../utils/AppError");

const clalculateCartItems = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  cart.totalpriceAfterDiscounte = undefined;
  cart.totalPrice = totalPrice;
};

// #desc Create Cart
// #route Post /api/v1/cart
// #Access  privet/("user")

exports.createCart = asyncHandler(async (req, res, next) => {
  let cart = await CART.findOne({ user: req.user._id });
  const product = await PRODUCT.findById(req.body.product);
  if (!cart) {
    //create cart for logged user with product
    cart = await CART.create({
      cartItems: [
        {
          product: req.body.product,
          quantity: req.body.quantity,
          color: req.body.color,
          price: product.price,
        },
      ],
      user: req.user._id,
    });
  } else {
    // product exist in cart , update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.product &&
        item.color === req.body.color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      console.log(cartItem);

      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // if product not exist ,push it in cartitems array

      cart.cartItems.push({
        product: req.body.product,
        quantity: req.body.quantity,
        color: req.body.color,
        price: product.price,
      });
    }
  }

  // calculate Total price
  clalculateCartItems(cart);
  await cart.save();

  res
    .status(200)
    .json({ status: "Success", length: cart.cartItems.length, cart });
});

// #desc Gat logged Cart
// #route Get /api/v1/cart
// #Access  privet/("user")

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CART.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError(`No cart for this user id ${req.user._id}`, 404));
  }

  res.status(200).json({
    status: "Success",
    length: cart.cartItems.length,
    cart,
  });
});

// #desc remove spacific Cart item
// #route delete /api/v1/cart/cartId
// #Access  privet/("user")

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CART.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.cartId } },
    },
    { new: true }
  );

  clalculateCartItems(cart);
  cart.save();

  res.status(200).json({
    status: "Success",
    length: cart.cartItems.length,
    cart,
  });
});

// #desc clear logged user cart
// #route Get /api/v1/cart
// #Access  privet/("user")

exports.clearCart = asyncHandler(async (req, res, next) => {
  await CART.findOneAndDelete({ user: req.user._id });

  res.status(204).json({ status: "Success" });
});

// #desc Update specific item quantitiy
// #route Put /api/v1/cart
// #Access  privet/("user")

exports.updateCartQuantity = asyncHandler(async (req, res, next) => {
  const cart = await CART.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError(`No cart for this user id ${req.user._id}`, 404));
  }

  const cartIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartId
  );

  if (cartIndex > -1) {
    const cartItem = cart.cartItems[cartIndex];
    cartItem.quantity = req.body.quantity;

    cart.cartItems[cartIndex] = cartItem;
  } else {
    return next(new AppError(`No item for this user id ${req.user._id}`, 404));
  }

  clalculateCartItems(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    length: cart.cartItems.length,
    cart,
  });
});

// #desc apply coupon
// #route Put /api/v1/cart
// #Access  privet/("user")

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await COUPON.findOne({
    name: req.body.coupon,
    expired: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError(`Invalid Coupon Name `, 404));
  }

  const cart = await CART.findOne({ user: req.user._id });

  const totalPrice = cart.totalPrice;

  const totalpriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalpriceAfterDiscount = totalpriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "Success",
    length: cart.cartItems.length,
    cart,
  });
});
