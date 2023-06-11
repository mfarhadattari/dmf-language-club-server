const express = require("express");
const { jwtVerify, adminVerify } = require("../middleware/middleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

// ! ------------------------- All Users --------------------------! //
router.get("/users", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const result = await userCollection.find().toArray();
  res.send(result.reverse());
});

// ! --------------------------- All Class ------------------------! //
router.get("/classes", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const result = await classCollection.find().toArray();
  res.send(result.reverse());
});

// ! ------------------------- Make Admin -------------------------! //
router.patch("/make-admin", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.body.email;
  const query = { email: email };
  const updateRole = {
    $set: {
      role: "admin",
    },
  };
  const result = await userCollection.updateOne(query, updateRole);
  res.send(result);
});

// ! ------------------------- Approve Class --------------------------! //
router.patch("/approve-class/:id", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const userCollection = req.userCollection;
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const instructorEmail = req.body.instructorEmail;
  const instructor = await userCollection.findOne({ email: instructorEmail });

  //! update status
  const updateStatus = {
    $set: {
      status: "approve",
    },
  };
  const updateStatusResult = await classCollection.updateOne(
    query,
    updateStatus
  );
  if (updateStatusResult.modifiedCount > 0) {
    //! update number of class
    const updateClass = {
      $set: {
        totalClass: (instructor?.totalClass || 0) + 1,
      },
    };
    const updateClassResult = await userCollection.updateOne(
      { email: instructorEmail },
      updateClass
    );

    res.send(updateClassResult);
  }
});

// ! ------------------------- Denied Class --------------------------! //
router.patch("/denied-class/:id", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateStatus = {
    $set: {
      status: "denied",
    },
  };
  const result = await classCollection.updateOne(query, updateStatus);
  res.send(result);
});

// ! ------------------------- Feedback --------------------------! //
router.post("/class-feedback/:id", jwtVerify, adminVerify, async (req, res) => {
  const classCollection = req.classCollection;
  const id = req.params.id;
  const body = req.body;
  const query = { _id: new ObjectId(id) };
  const updateStatus = {
    $set: {
      feedback: body.feedback,
    },
  };
  const result = await classCollection.updateOne(query, updateStatus);
  res.send(result);
});

module.exports = router;
