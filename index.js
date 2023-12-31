const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ! Middleware
app.use(cors());
app.use(express.json());

// !------------------- ROUTES IMPORT ------------------- //
const publicRoute = require("./routes/public");
const otherRoute = require("./routes/other");
const adminRoute = require("./routes/admin");
const instructorRoute = require("./routes/instructor");
const studentRoute = require("./routes/student");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxhaoz0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    // !----------- Database Collections ---------------- //
    const database = client.db("dmf-language-club");
    app.use((req, res, next) => {
      req.userCollection = database.collection("users");
      req.classCollection = database.collection("classes");
      req.reviewCollection = database.collection("reviews");
      req.cartCollection = database.collection("carts");
      req.orderCollection = database.collection("orders")
      next();
    });

    // ! ------------- Route Middleware ------------------ //
    app.use("/", publicRoute);
    app.use("/", otherRoute);
    app.use("/instructor", instructorRoute);
    app.use("/admin", adminRoute);
    app.use("/student", studentRoute);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ! HOME Route
app.get("/", (req, res) => {
  res.send("DMF Language Club");
});

app.listen(port, () => {
  console.log(`DMF Language Club is Running on ${port}`);
});
