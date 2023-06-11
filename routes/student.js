const express = require("express");
const { jwtVerify, studentVerify } = require("../middleware/middleware");
const router = express.Router();

// !----------------------- ADD TO Cart --------------------! //
router.post("/add-to-cart", jwtVerify, studentVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const cart = req.body;
  const result = await cartCollection.insertOne(cart);
  res.send(result);
});

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

module.exports = router;
