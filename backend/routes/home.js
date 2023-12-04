const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const { join } = require("path");
const mediaModel = require("../models/media");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(async (req, res) => {
    try {
      const videos = await mediaModel.find();
      res.json(videos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(upload.single("photo"), async (req, res) => {
    try {
      const { title, description, trailer } = req.body;
      if (!title || !trailer) {
        return res.status(400).json({ alert: "Title or trailer missing" });
      }

      const filmExists = await mediaModel.findOne({ title: title });
      let photofilename = req.body.photo;
      if (req.file) {
        photofilename = `${Date.now()}.jpeg`;
        const filePath = join(__dirname, "public/filmimages", photofilename);
        console.log("File Path:", filePath);

        await sharp(photofilename)
          .resize(480, 360)
          .jpeg({ mozjpeg: true, quality: 60 })
          .toFile(filePath);
      }

      if (!filmExists) {
        const newMovie = new mediaModel({
          title,
          description,
          trailer,
          photo: photofilename,
        });

        await newMovie.save();
        return res.status(201).json({ alert: `${title} Saved` });
      } else {
        return res.status(409).json({ alert: `${title} already exists` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/:id")
  .delete(async (req, res) => {
    const { id } = req.params;
    const convertedString = String(id);
    const filmExists = await mediaModel.findOne({ _id: convertedString });
    if (!filmExists) {
      return res.status(404).json({ Alert: "Film doesn't exist" });
    } else {
      await mediaModel.deleteOne({ _id: id });
      return res.status(200).json({ Alert: "Film Deleted" });
    }
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { filmname } = req.body;
    const convertedString = String(id);
    const filmExists = await mediaModel.findOne({ _id: convertedString });
    if (!filmExists) {
      return res.status(404).json({ Alert: "Film doesn't exist" });
    } else {
      await mediaModel.findOneAndUpdate({ title: filmname });
      return res.status(200).json({ Alert: "Film Updated" });
    }
  });

module.exports = router;
