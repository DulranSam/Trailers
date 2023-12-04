const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cluster = process.env.CLUSTER;
const cors = require("cors");
const mongoose = require("mongoose");
const homepage = require("./routes/home");

app.use(express.json());
app.use(cors());

app.use("/home", homepage);

async function start() {
  try {
    await mongoose.connect(cluster, { useNewUrlParser: true });
    app.listen(port, console.log(`Servers up on port ${port}`));
  } catch (err) {
    console.error(err);
  }
}

start();
