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
  const cartCollection = req.cartCollection;
  const orderCollection = req.orderCollection;
  const email = req.query.email;
  const id = req.params.id;
  const query = { classId: id, email: email };
  const inCart = await cartCollection.findOne(query);
  const inOrder = await orderCollection.findOne(query);
  if (inCart) {
    return res.send({ status: "selected" });
  } else if (inOrder) {
    return res.send({ status: "enrolled" });
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

// !----------------------- MY Enrolled ----------------------------! //
router.get("/my-enrolled", jwtVerify, studentVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const email = req.query.email;
  const myEnrolled = await orderCollection.find({ email: email }).toArray();
  res.send(myEnrolled);
});

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

// !------------------------ Order Confirmation -------------! //
router.post("/order-confirm", jwtVerify, studentVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const cartCollection = req.cartCollection;
  const classCollection = req.classCollection;
  const userCollection = req.userCollection;
  const data = req.body;
  const { cartId, classId, instructorEmail } = data;

  // ! Update Class Info
  const classInfo = await classCollection.findOne({
    _id: new ObjectId(classId),
  });
  if (classInfo) {
    const updateClass = {
      $set: {
        availableSeats: classInfo.availableSeats - 1,
        enrolledStudents: (classInfo.enrolledStudents || 0) + 1,
      },
    };

    const updateResult = await classCollection.updateOne(
      { _id: new ObjectId(classId) },
      updateClass
    );
    if (updateResult.modifiedCount > 0) {
      // ! Update instructor info
      const instructor = await userCollection.findOne({
        email: instructorEmail,
        role: "instructor",
      });
      if (instructor) {
        const updateInstructor = {
          $set: {
            totalStudent: (instructor?.totalStudent || 0) + 1,
          },
        };
        const instructorResult = await userCollection.updateOne(
          { email: instructorEmail },
          updateInstructor
        );
        if (instructorResult.modifiedCount > 0) {
          // ! Remove from cart
          const removeResult = await cartCollection.deleteOne({
            _id: new ObjectId(cartId),
          });
          if (removeResult.deletedCount > 0) {
            // ! Save in Orders
            const result = await orderCollection.insertOne(data);
            return res.send(result);
          }
        }
      }
    }
  }
});

// !---------------------- Payment History ---------------------! //
router.get("/payment-history", async (req, res) => {
  const orderCollection = req.orderCollection;
  const email = req.query.email;
  const sort = { paymentTime: -1 };
  const result = await orderCollection
    .find({ email: email })
    .sort(sort)
    .toArray();
  res.send(result);
});

module.exports = router;
