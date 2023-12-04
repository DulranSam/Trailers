const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      default: "",
    },
    description: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      min: 5,
      default: "",
    },
    trailer: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const movieModel = mongoose.model("movies", movieSchema);
module.exports = movieModel;
