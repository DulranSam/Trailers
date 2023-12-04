const express = require("express");
const router = express.Router();
const mediaModel = require("../models/media");
require("dotenv").config();
const mapskey = process.env.MAPSKEY;
const sharp = require("sharp");
const { join } = require("path");
const Axios = require("axios");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(async (req, res) => {
    const videos = await mediaModel.find();
    res.json(videos);
  })
  .post(upload.single("photo"), async (req, res) => {
    const { title, description, trailer, photo } = req.body;
    if (!title || !trailer) {
      return res.status(400).json({ Alert: "Title or trailer missing" });
    }

    const filmExists = await mediaModel.findOne({ title: title });
    let photofilename = photo;
    if (req.file) {
      photofilename = `${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(480, 360)
        .jpeg({ mozjpeg: true, quality: 60 })
        .toFile(join(__dirname, "public/filmimages", photofilename));
    }
    if (!filmExists) {
      const newMovie = new mediaModel({
        title,
        description,
        trailer,
        photo: photofilename,
      });

      await newMovie.save();
      return res.status(200).json({ Alert: `${title} Saved` });
    } else {
      return res.status(409).json({ Alert: `${title} already exists` });
    }
  })
  .put()
  .delete();

router
  .route("/sub")
  .get(async (req, res) => {
    const r = await Axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        headers: {
          Authorization: `Bearer ${mapskey}`,
        },
      }
    ).then((r) => {
      res.json(r.data);
    });
  })
  .post(async (req, res) => {
    try {
      const r = await Axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${mapskey}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          data: {
            homeMobileCountryCode: 310,
            homeMobileNetworkCode: 410,
            radioType: "gsm",
            carrier: "Vodafone",
            considerIp: true,
          },
        }
      ).then((r) => {
        res.json(r.data);
      });
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
