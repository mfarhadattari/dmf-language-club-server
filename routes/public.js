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

module.exports = router;
