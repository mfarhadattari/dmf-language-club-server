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

// !----------------------- Instructor Profile ---------------------! //
router.get("/profile", jwtVerify, instructorVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.query.email;
  const query = { email: email };
  const personalInfo = await userCollection.findOne(query);
  res.send(personalInfo);
});

module.exports = router;
