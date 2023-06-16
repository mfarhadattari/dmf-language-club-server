const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtVerify } = require("../middleware/middleware");
require("dotenv").config();
const router = express.Router();

// !--------------- JWT TOKEN GENERATE ---------------! //
router.post("/generate-jwt", (req, res) => {
  const data = req.body;
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token: token });
});

// !--------------- USER ROLE ---------------! //
router.get("/user-role", jwtVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const query = { email: email };
  const result = await userCollection.findOne(query);
  res.send({ role: result?.role || "student" });
});

// !---------------- Create User -----------------! //
router.post("/create-user", async (req, res) => {
  const userCollection = req.userCollection;
  const data = req.body;
  const query = { email: data.email };
  const isExist = await userCollection.findOne(query);
  if (isExist) {
    return res.send({ isExist: true });
  }
  const result = await userCollection.insertOne(data);
  res.send(result);
});

// !---------------- User Profile ----------------! //
router.get("/user-profile", jwtVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const query = { email: email };
  const result = await userCollection.findOne(query);
  res.send(result);
});

module.exports = router;
