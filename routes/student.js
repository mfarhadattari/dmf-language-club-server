const express = require("express");
const { jwtVerify, studentVerify } = require("../middleware/middleware");
const { ObjectId } = require("mongodb");
const router = express.Router();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

// !----------------------- ADD TO Cart --------------------! //
router.post("/add-to-cart", jwtVerify, studentVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const cart = req.body;
  const result = await cartCollection.insertOne(cart);
  res.send(result);
});

// !---------------------- Check Class Status ------------! //
router.get("/check-class/:id", jwtVerify, studentVerify, async (req, res) => {
  // TODO: Also check if paid or ordered
  const cartCollection = req.cartCollection;
  const email = req.query.email;
  const id = req.params.id;
  const query = { classId: id, email: email };
  const inCart = await cartCollection.findOne(query);
  if (inCart) {
    return res.send({ status: "selected" });
  } else {
    return res.send({ status: null });
  }
});

// !--------------------- GET CARTS -------------------! //
router.get("/my-carts", jwtVerify, studentVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const email = req.query.email;
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result.reverse());
});

// !--------------------- Delete from CARTS -------------------! //
router.delete(
  "/delete-from-carts/:id",
  jwtVerify,
  studentVerify,
  async (req, res) => {
    const cartCollection = req.cartCollection;
    const id = req.params.id;
    const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  }
);

// !--------------------- GET Cart item Info ----------------------! //
router.get(
  "/cart-item-info/:id",
  jwtVerify,
  studentVerify,
  async (req, res) => {
    const cartCollection = req.cartCollection;
    const id = req.params.id;
    const result = await cartCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  }
);

// !-------------------- Payment Intent -----------------! //
router.post(
  "/create-payment-intent",
  jwtVerify,
  studentVerify,
  async (req, res) => {
    const data = req.body;
    const price = parseInt(data.price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  }
);

// !------------------------ Payment Confirmation -------------! //
router.post("/order-confirm", jwtVerify, studentVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const cartCollection = req.cartCollection;
  const data = req.body;
  const { cartId } = data;
  const removeResult = await cartCollection.deleteOne({
    _id: new ObjectId(cartId),
  });
  if (removeResult.deletedCount > 0) {
    const result = await orderCollection.insertOne(data);
    return res.send(result);
  }
});
module.exports = router;
