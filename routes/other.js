const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtVerify } = require("../middleware/middleware");
require("dotenv").config();
const route = express.Router();

// !--------------- JWT TOKEN GENERATE ---------------! //
route.post("/generate-jwt", (req, res) => {
  const data = req.body;
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token: token });
});

// !--------------- USER ROLE ---------------! //
route.get("/user-role", jwtVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const query = { email: email };
  const result = await userCollection.findOne(query);
  res.send({ role: result?.role || student });
});
module.exports = route;
