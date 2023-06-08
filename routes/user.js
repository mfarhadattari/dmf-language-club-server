const express = require("express");
const router = express.Router();

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

module.exports = router;
