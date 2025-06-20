const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const cors = require("cors");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error - " + error.message,
      error: true,
      success: false,
    });
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;

    // Object.keys(req.body).forEach((key) => {
    //   if (req.body[key]) {
    //     loggedInUser[key] = req.body[key];
    //   }
    // });

    // Step 1: Remove all existing fields
    Object.keys(loggedInUser.toObject()).forEach((key) => {
      if (key !== "_id" && key !== "__v") {
        loggedInUser.set(key, undefined);
      }
    });

    // Step 2: Assign new fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser.set(key, req.body[key]);
    });
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
});

module.exports = profileRouter;
