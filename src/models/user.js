const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let SECRET_KEY = "THIS_IS_MY_SECRET_KEY";
const userSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      required: true,
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      required: true,
      lowercase: true,
      type: String,
      unique: true,
      trim: true,
      immutable: true,
      validate: [
        function (email) {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email);
        },
        "Please fill a valid email address",
      ],
    },
    password: {
      required: true,
      type: String,
    },
    gender: {
      type: String,
      enum:{
        values: ['male','female', 'others'],
        message:`{VALUE} is not a valid gender`
      }
    },
    image: {
      type: String,
    },
    about: {
      type: String,
      default: "This is about of a user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("skills length should be less than 1");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  return await jwt.sign({ _id: this._id }, SECRET_KEY, {
    expiresIn: "1d",
  });
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
