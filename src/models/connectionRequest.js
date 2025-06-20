const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
       ref:"User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected", "pending"],
        message: `{VALUE} is not valid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequest
);

module.exports = ConnectionRequestModel;
