const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// ! Middleware
app.use(cors());
app.use(express.json());

// ! HOME Route
app.get("/", (req, res) => {
  res.send("DMF Language Club");
});

app.listen(port, () => {
  console.log(`DMF Language Club is Running on ${port}`);
});
