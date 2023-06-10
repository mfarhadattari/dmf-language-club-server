const express = require("express");
const { jwtVerify, adminVerify } = require("../middleware/middleware");
const router = express.Router();

router.get("/users", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const result = await userCollection.find().toArray();
  res.send(result);
});

module.exports = router;
