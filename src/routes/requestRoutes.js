const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

const sendEmail = require('../utils/sendEmail') 

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req?.user?._id;

      const { firstName, lastName } = req?.user || {};

      const { toUserId, status } = req?.params || {};

      let allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status type : " + status,
        });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({
          success: false,
          message: `User ${toUserId} does not exist in our DB`,
        });
      }

      // // checks if we are sending request to ourself
      // if (fromUserId.toString() === toUserId) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "You cannot send connection request to yourself",
      //   });
      // }

      // checks if other user has already sent us request or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
          {
            fromUserId,
            toUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          success: false,
          message: `Connection request already exist between ${firstName} ${lastName} and ${toUser.firstName} ${toUser.lastName}`,
        });
      }

      const user = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await user.save();

      const sendEmailResponse = await sendEmail.run({subject:"Sent Request in devder.site", body:status === "ignored"
            ? `${firstName} ${lastName} ignored ${toUser?.firstName} ${toUser?.lastName}`
            : `${firstName} ${lastName} is interested in ${toUser?.firstName} ${toUser?.lastName}`})

      res.status(200).json({
        success: true,
        message:
          status === "ignored"
            ? `${firstName} ${lastName} ignored ${toUser?.firstName} ${toUser?.lastName}`
            : `${firstName} ${lastName} is interested in ${toUser?.firstName} ${toUser?.lastName}`,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        success: false,
        message: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      let loggedInUser = req.user;
      const { status, requestId } = req.params;

      let allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status Is Invalid`,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          success: false,
          message: `Request not allowed`,
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      return res.json({
        success: true,
        message: `Request ${status}`,
        data,
      });
    } catch (error) {
      // throw new Error('Error occurred in request review API', error)
      console.log("ERROR : ", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

requestRouter.get("/sent/requests", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    console.log({ loggedInUser });

    const sentRequest = await ConnectionRequest.find({
      $and: [
        { fromUserId: loggedInUser._id.toString() },
        { status: "interested" },
      ],
    }).populate("toUserId", ["firstName", "lastName", "about", "image"]).select('toUserId');

    console.log({ sentRequest });

    res.json({
      success: true,
      data: sentRequest,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = requestRouter;
