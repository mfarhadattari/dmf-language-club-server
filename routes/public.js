const express = require("express");
const router = express.Router();

router.get("/popular-classes", async (req, res) => {
  const classCollection = req.classCollection;
  const query = {};
  const option = {
    sort: { enrolledStudents: -1 },
  };
  const result = await classCollection.find(query, option).limit(6).toArray();
  res.send(result);
});

router.get("/popular-instructor", async (req, res) => {
  const userCollection = req.userCollection;
  const query = { role: "instructor" };
  const option = {
    sort: { totalStudent: -1 },
  };
  const result = await userCollection.find(query, option).limit(6).toArray();
  res.send(result);
});

router.get("/reviews", async (req, res) => {
  const reviewCollection = req.reviewCollection;
  const result = await reviewCollection.find().toArray();
  res.send(result.reverse());
});

module.exports = router;
