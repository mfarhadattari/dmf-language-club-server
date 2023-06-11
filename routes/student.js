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

module.exports = router;
