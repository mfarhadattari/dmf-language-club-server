const express = require("express");
const { jwtVerify, instructorVerify } = require("../middleware/middleware");
const router = express.Router();

router.post("/add-class", jwtVerify, instructorVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const data = req.body;
  console.log(data);
  const result = await classCollection.insertOne(data);
  res.send(result);
});

module.exports = router;
