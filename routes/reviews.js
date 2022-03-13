const auth = require("../middleware/auth");
const _ = require("lodash");
const { Review, validate } = require("../models/review");
const mongoose = require("mongoose");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();

// -----------------------------------------------------------------------------------

router.get("/", [auth, admin], async (req, res) => {
  const review = await Review.find();
  res.send(review);
});

router.delete("/", [auth, admin], (req, res) => {
  User.findByIdAndDelete(req.body.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.send(user);
    }
  });
});

// -----------------------------------------------------------------------------------

router.get("/me", auth, async (req, res) => {
  const review = await Review.find({ "user.id": req.user._id });
  res.send(review);
});

router.delete("/me", auth, (req, res) => {
  User.findByIdAndDelete(req.body.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.send(user);
    }
  });
});

router.post("/me", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const review = new Review({
    rating: req.body.rating,
    review: req.body.review,
    userID: req.body.userID,
    userName: req.body.userName,
    mediaType: req.body.mediaType,
    mediaID: req.body.mediaID,
  });

  await review.save();
  res.send(review);
});

// -----------------------------------------------------------------------------------

module.exports = router;
