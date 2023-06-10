require("dotenv").config();
const jwt = require("jsonwebtoken");

// !-------------- JWT Verify ------------! //
const jwtVerify = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, ...err });
    }
    req.decoded = decoded;
    next();
  });
};

// !----------------- ADMIN VERIFY ---------------! //
const adminVerify = async (req, res, next) => {
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const userCollection = req.userCollection;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  if (user?.role === "admin") {
    return next();
  }
  return res.status(403).send({ error: true, message: "Access Forbidden" });
};

// !----------------- INSTRUCTOR VERIFY ---------------! //
const instructorVerify = async (req, res, next) => {
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const userCollection = req.userCollection;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  if (user?.role === "instructor") {
    return next();
  }
  return res.status(403).send({ error: true, message: "Access Forbidden" });
};

module.exports = { jwtVerify, adminVerify, instructorVerify };
