const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cluster = process.env.CLUSTER;
const cors = require("cors");
const mongoose = require("mongoose");
const homepage = require("./routes/home");
const { join } = require("path");
const fs = require("fs");

app.use(express.json());
app.use(cors());
if (!fs.existsSync(join(__dirname, "public"))) {
  fs.mkdirSync(join(__dirname, "public"));
}
app.use(express.static(join(__dirname, "public")));
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
