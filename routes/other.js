const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const route = express.Router();

// !--------------- JWT TOKEN GENERATE ---------------! //
route.post("/generate-jwt", (req, res) => {
  const data = req.body;
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({token: token});
});

module.exports = route;
