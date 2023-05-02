const express = require("express");
const userRoute = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/usermodel");

userRoute.post("/register", async (req, res) => {
  const { name, email, password, gender, city, age, is_married } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).send({ msg: "user already exist" });
    } else {
      bcrypt.hash(password, 4, async (err, hash) => {
        const newUser = new UserModel({
          name,
          email,
          password: hash,
          gender,
          city,
          age,
          is_married,
        });
        await newUser.save();
        res.status(200).json({ msg: "new user registered successfuly" });
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});
userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(200).json({ msg: "Please register first" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { authorID: user._id, author: user.name },
            "masai"
          );
          res.status(200).json({ msg: "login successful", token: token });
        } else {
          res.status(200).json({ msg: "wrong Credential" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});
module.exports = { userRoute };
