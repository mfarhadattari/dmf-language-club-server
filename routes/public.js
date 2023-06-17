const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// !------------------ POPULAR CLASSES ----------------! //
router.get("/popular-classes", async (req, res) => {
  const classCollection = req.classCollection;
  const query = { status: "approve" };
  const option = {
    sort: { enrolledStudents: -1 },
  };
  const result = await classCollection.find(query, option).limit(6).toArray();
  res.send(result);
});

// !------------------ ALL CLASS ----------------! //
router.get("/all-classes", async (req, res) => {
  const classCollection = req.classCollection;
  const query = { status: "approve" };
  const result = await classCollection.find(query).toArray();
  res.send(result.reverse());
});

// !------------------ POPULAR INSTRUCTORS ----------------! //
router.get("/popular-instructors", async (req, res) => {
  const userCollection = req.userCollection;
  const query = { role: "instructor" };
  const option = {
    sort: { totalStudent: -1 },
  };
  const result = await userCollection.find(query, option).limit(6).toArray();
  res.send(result);
});

// !------------------ ALL INSTRUCTORS ----------------! //
router.get("/all-instructors", async (req, res) => {
  const userCollection = req.userCollection;
  const query = { role: "instructor" };
  const result = await userCollection.find(query).toArray();
  res.send(result);
});

// !------------------ CLASS OF AN INSTRUCTOR ----------------! //
router.get("/instructors/:id", async (req, res) => {
  const userCollection = req.userCollection;
  const classCollection = req.classCollection;
  const id = req.params.id;
  const instructorInfo = await userCollection.findOne({
    _id: new ObjectId(id),
  });
  const email = instructorInfo.email;
  const query = { instructorEmail: email, status: "approve" };
  const classes = await classCollection.find(query).toArray();
  res.send({ instructorInfo, instructorClasses: classes.reverse() });
});

// !------------------ USERS REVIEWS ----------------! //
router.get("/reviews", async (req, res) => {
  const reviewCollection = req.reviewCollection;
  const result = await reviewCollection.find().toArray();
  res.send(result.reverse());
});

module.exports = router;
