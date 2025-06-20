const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");

const ConnectionRequest = require("../models/connectionRequest");

const SAFE_DATA = "firstName lastName skills age about image gender";

// GET USER FEEDS
userRouter.get("/user/feeds", userAuth, async (req, res) => {
  try {
    let loggedInUser = req?.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    });

    let hideUsersFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });

    hideUsersFromFeed = new Set([...hideUsersFromFeed].filter(userId =>  userId!==loggedInUser._id)) 

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(SAFE_DATA)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });


    res.json({
      message: "get user successfully",
      data: users,
      success: true
    });
  } catch (err) {
    res.status(400).json({
      message: "Error - " + error.message,
      error: true,
      success: false,
    });
  }
});

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    let loggedInUser = req?.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", 'about', 'image']);

    res.status(200).json({
      message: "fetched data successfully",
      data: connectionRequests,
      success: true
    });
  } catch (error) {
    console.log("ERROR : ", error.message);
    res.status(400).json({ message: error.message, success: false });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    let loggedInUser = req.user;


    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", 'about', 'image'])
      .populate("toUserId", ["firstName", "lastName",'about', 'image']);


    let data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.status(200).json({
      messsage: "fetched successfully",
      data: data,
      success: true
    });
  } catch (error) {
    console.log("Error :", error.message);

    res.status(400).json({
      message: error?.message,
    });
  }
});

userRouter.patch("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { image } = req.body;

    const user = await User.findByIdAndUpdate({ _id: userId }, { image });

    console.log({ user });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("Update user error", error.message);
    res.status(400).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/:userId", userAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: "Fetch user successfully",
      data: user,
    });
  } catch (error) {
    console.log("Update user error", error.message);
    res.status(400).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
});

module.exports = userRouter;
