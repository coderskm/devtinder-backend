const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  // fetching cookies from request
  try {
    const user = req.userLoggedIn;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    
    const userLoggedIn = req.userLoggedIn;
    Object.keys(req.body).forEach((key) => (userLoggedIn[key] = req.body[key]));
    await userLoggedIn.save();
    
    res.status(200).json({
      message: `${userLoggedIn.firstName}, your profile is updated`,
      data: userLoggedIn
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
