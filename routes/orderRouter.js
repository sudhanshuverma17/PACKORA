const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

 
router.get("/checkout", isLoggedIn, async (req, res) => {
  if(!req.user.cart || req.user.cart.length === 0) {
    return res.redirect("/cart");
  }
  let user = await userModel.findById(req.user._id).populate("cart.product");

  let total = 0;

  user.cart.forEach((item) => {
    total += (item.product.price - item.product.discount) * item.quantity;
  });

  res.render("checkout", { user, total, loggedin: true,key_Id: instance.key_id });
});

 
router.post("/place", isLoggedIn, async (req, res) => {

  let user = await userModel
    .findById(req.user._id)
    .populate("cart.product");

  if (!user.cart || user.cart.length === 0) {
    return res.redirect("/cart");
  }

  let total = 0;
  let items = [];

  user.cart.forEach((item) => {

    if (!item.product) return;  

    let product = item.product;

    let itemTotal =
      (Number(product.price) - Number(product.discount)) * item.quantity;

    total += itemTotal;

    items.push({
      product: {
        name: product.name,
        price: product.price,
        discount: product.discount
      },
      quantity: item.quantity
    });

  });

  //  create order (COD)
  await orderModel.create({
    user: user._id,
    items: items,
    totalAmount: total,
    status: "cod"   //  FIXED
  });

  // 🧹 clear cart
  user.cart = [];
  await user.save();

  res.redirect("/orders");
});

router.get("/orders/:id", isLoggedIn, async (req, res) => {
  let order = await orderModel.findById(req.params.id);

  // security: ensure user owns this order
  if (!order || order.user.toString() !== req.user._id.toString()) {
    return res.send("Unauthorized");
  }

  res.render("orderDetails", {
    order,
    user: req.user,
    loggedin: true,
  });
});

//  VIEW ORDERS
router.get("/orders", isLoggedIn, async (req, res) => {
  let orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.render("orders", { orders, user: req.user, loggedin: true ,currentPath: req.path});
});

router.post("/create-order", isLoggedIn, async (req, res) => {
  let user = await userModel.findById(req.user._id).populate("cart.product");

  let total = 0;

  user.cart.forEach((item) => {
    total += (item.product.price - item.product.discount) * item.quantity;
  });

  const options = {
    amount: total * 100, // paise
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});


router.post("/verify-payment", isLoggedIn, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const secret = instance.key_secret;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");


    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

     

    const user = await userModel
      .findById(req.user._id)
      .populate("cart.product");

    let total = 0;
    let items = [];

    user.cart.forEach((item) => {
      total += (item.product.price - item.product.discount) * item.quantity;

      items.push({
        product: {
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount,
        },
        quantity: item.quantity,
      });
    });

     
    await orderModel.create({
      user: user._id,
      items,
      totalAmount: total,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid",
    });

    //  CLEAR CART
    user.cart = [];
    await user.save();

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (err) {
    console.log(err);
    returnres.status(500).json({ error: err.message });
  }
});

module.exports = router;
