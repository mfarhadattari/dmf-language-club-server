const express = require("express");
const { jwtVerify, instructorVerify } = require("../middleware/middleware");
const router = express.Router();

// !------------------- Add Class -------------------! //
router.post("/add-class", jwtVerify, instructorVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const data = req.body;
  const result = await classCollection.insertOne(data);
  res.send(result);
});

// !------------------ My Class -------------------! //
router.get("/my-classes", jwtVerify, instructorVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const email = req.query.email;
  const query = { instructorEmail: email };
  const result = await classCollection.find(query).toArray();
  res.send(result.reverse());
});

// !----------------------- Instructor Data ---------------------! //
router.get("/data", jwtVerify, instructorVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const orderCollection = req.orderCollection;
  const email = req.query.email;
  const totalStudent = await orderCollection.countDocuments({
    instructorEmail: email,
  });
  const totalClass = await classCollection.countDocuments({
    instructorEmail: email,
  });
  const approveClass = await classCollection.countDocuments({
    instructorEmail: email,
    status: "approve",
  });
  const pendingClass = await classCollection.countDocuments({
    instructorEmail: email,
    status: "pending" || !status,
  });
  const deniedClass = await classCollection.countDocuments({
    instructorEmail: email,
    status: "denied",
  });
  res.send({
    totalStudent,
    totalClass,
    approveClass,
    pendingClass,
    deniedClass,
  });
});

module.exports = router;
