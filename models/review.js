const Joi = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    default: 0,
    minlength: 0,
    maxlength: 10,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  userID: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  mediaID: {
    type: String,
    required: true,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
});

const Review = mongoose.model("Review", reviewSchema);

function validateReview(review) {
  const schema = Joi.object().keys({
    rating: Joi.number().required().min(0).max(10),
    review: Joi.string().required().trim(),
    userID: Joi.string().required(),
    userName: Joi.string().required(),
    mediaType: Joi.string().required(),
    mediaID: Joi.string().required(),
    reportCount: Joi.number(),
    likeCount: Joi.number(),
    dislikeCount: Joi.number(),
  });
  return schema.validate(review);
}

exports.Review = Review;
exports.validate = validateReview;
