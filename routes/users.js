const auth = require("../middleware/auth");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();

// -----------------------------------------------------------------------------------

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// -----------------------------------------------------------------------------------

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send(token);
  // .header("x-auth-token", token)
  // .header("Access-Control-Allow-Headers", "x-auth-token")
  // .send(_.pick(user, ["_id", "name", "email"]));
});

// -----------------------------------------------------------------------------------

router.post("/login", async (req, res) => {
  console.log("login req.body", req.body);
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateLogin(req) {
  const schema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
}

// -----------------------------------------------------------------------------------

router.get("/", [auth, admin], async (req, res) => {
  const user = await User.find();
  res.send(user);
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

module.exports = router;
