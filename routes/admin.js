const express = require("express");
const { jwtVerify, adminVerify } = require("../middleware/middleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.get("/users", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const result = await userCollection.find().toArray();
  res.send(result.reverse());
});
router.get("/classes", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const result = await classCollection.find().toArray();
  res.send(result.reverse());
});

router.patch("/approve-class/:id", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateStatus = {
    $set: {
      status: "approve",
    },
  };
  const result = await classCollection.updateOne(query, updateStatus);
  res.send(result);
});

module.exports = router;
