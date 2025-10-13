const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address :- " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is incorrect gender type`,
      },
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "https://tinyurl.com/3kvu73ft",
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photo :- " + value);
        }
      },
    },
    about: {
      type: String,
      default: "I am awesome !",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// mongoose schema methods
// always use normal function
userSchema.methods.getJWT = async function () {
  const user = this; // reference to current user
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
