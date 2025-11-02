const express = require("express");
const validateSignUpData = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();
// SIGN UP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hashPassword,
    });

    await user.save();
    res.status(200).json({
      success: true,
      message: "signup successful",
    });
  } catch (error) {
    console.log("ERROR ", error);

    res.status(500).json({
      success: false,
      message: "Please check your input",
      error: error.message,
    });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email) {
      throw new Error("Please provide email");
    }

    if (!password) {
      throw new Error("Please provide paassword");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Provided email is not registered");
    }

    let isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Password is incorrect");
    }

    const token = await user.getJWT();

    // write all logic here

    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

    res.status(200).json({
      success: true,
      message: "You are successfully logged in",
      data: user,
    });
  } catch (error) {
    console.log("err ?????", error);
    res.status(500).json({
      success: false,
      message: error?.message,
      error: true,
    });
  }
});

// LOGOUT
// authRouter.get("/logout", (req, res, next) => {
//   try {
//     res.clearCookie("token");
//     res.send("logout successful");
//   } catch (error) {
//     res.send("Error : " + error?.message);
//   }
// });

// LOGOUT
authRouter.get("/logout", (req, res, next) => {
  try {
    res
      .cookie("token", null, {
        maxAge: 0,
      })
      .json({ message: "logout successful", success: true });
  } catch (error) {
    res.status(400).json({
      message: "Error - " + error.message,
      error: true,
      success: false,
    });
  }
});

module.exports = authRouter;
