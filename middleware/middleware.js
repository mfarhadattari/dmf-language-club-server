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

module.exports = { jwtVerify };
