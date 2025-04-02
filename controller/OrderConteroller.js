const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const ApiFeature = require("../utils/ApiFeature");
const factory = require("./HandlerFactory");
const PRODUCT = require("../Model/ProductModel");
const AppError = require("../utils/AppError");

const USER = require("../Model/UserModel");
const CART = require("../Model/CartModel");
const ORDER = require("../Model/OrderModel");

// #desc Create cash order
// #route Post /api/v1/order/cartId
// #Access  privet/('user')

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1)Get cart depend on cartId
  const cart = await CART.findById(req.params.cartId);
  if (!cart) {
    return next(
      new AppError(`There is no cart for this cart id ${req.params.cartId}`)
    );
  }
  // 2)Get order price depend on cart price (check if coupon apply)
  const cartPrice = cart.totalpriceAfterDiscount
    ? cart.totalpriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) create order with defult pyament Method (cash)
  const order = await ORDER.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order , decrement product quantity , increment product sold,

  if (order) {
    const BulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await PRODUCT.bulkWrite(BulkOptions, {});

    // 5) cleat Card depen on CartId

    await CART.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ Status: "Success", Data: order });
});

exports.filterObject = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
});

// #desc Get All user order
// #route Post /api/v1/order
// #Access  privet/('user',"admin")

exports.GetAllUserOrder = factory.GetAll(ORDER);

// #desc Get specifc user order
// #route Post /api/v1/order/:id
// #Access  privet/('user',"admin")

exports.GetSpecifcUserOrder = factory.GetOne(ORDER);

// #desc  Update Order Paid Status
// #route Put /api/v1/order/:id
// #Access  privet/('manger',"admin")
exports.updateOrderPaidStatus = asyncHandler(async (req, res, next) => {
  const order = await ORDER.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no order for this order id ${req.params.id}`)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();

  res.status(201).json({ Status: "Success", Data: order });
});

// #desc  Update Order Deliver Status
// #route Put /api/v1/order/:id
// #Access  privet/('manger',"admin")
exports.updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {
  const order = await ORDER.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no order for this order id ${req.params.id}`)
    );
  }

  order.isDelivered = true;
  order.DeliveredAt = Date.now();

  await order.save();

  res.status(201).json({ Status: "Success", Data: order });
});

//  #desc  Create Stripe Checkout session
// #route Get /api/v1/order/checkout-Session/:cartID
// #Access  privet/('user')

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1)Get cart depend on cartId
  const cart = await CART.findById(req.params.cartId);
  if (!cart) {
    return next(
      new AppError(`There is no cart for this cart id ${req.params.cartId}`)
    );
  }
  // 2)Get order price depend on cart price (check if coupon apply)
  const cartPrice = cart.totalpriceAfterDiscount
    ? cart.totalpriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3)Create Stripe Checkout session

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp", // The currency for the payment
          product_data: {
            name: req.user.name, // The name of the product (which in this case is the user's name)
          },
          unit_amount: totalOrderPrice * 100, // Price in the smallest currency unit (EGP piasters)
        },
        quantity: 1, // Quantity of the item being purchased
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.user.shippingAddress,
  });

  res.status(200).json({ status: "Success", session });
});

// #desc  check if checkout session completed ,then create card order
// #route Post /webhook
// #Access  privet/('user')
const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;

  const user = await User.find({ email: session.customer_email });
  const cartItems = await CART.findById(cartId);
  const shippingAddress = session.metadata;
  const totalOrderPrice = session.amount_total;
  // 1) create order with card method
  const order = await ORDER.create({
    user,
    cartItems,
    shippingAddress,
    totalOrderPrice,
    paymentMethodType: "card",
    isPaid: true,
    paidAt: Date.now(),
  });
};

// 2) After creating order , decrement product quantity , increment product sold,
if (order) {
  const BulkOptions = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  await PRODUCT.bulkWrite(BulkOptions, {});

  // 3) cleat Card depen on CartId

  await CART.findByIdAndDelete(cartId);
}

exports.webHookCheckout = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
