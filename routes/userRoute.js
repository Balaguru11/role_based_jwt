const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const database = require("../configuration/database");
const conn = database.connect();
const pushMail = require("../configuration/email.settings");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/uploads");
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         // console.log(file.originalname);
//         cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
//     }
// })
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 2000000
//     }
// });

const fs = require("fs");

const uploadImage = async (req, res, next) => {
  try {
    const path = "../public/uploads" + Date.now() + ".png";
    console.log(path);

    const imageData = req.body.avatar;
    const base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    console.log(base64Data);

    fs.writeFileSync(path, base64Data, { encoding: "base64" });
    return res.send(path);
  } catch (err) {
    next(err);
  }
};

// joi validator instead of express validator

// profile get

userRoute.get("/my-profile", auth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    if (user) {
      // find if profile exist or not

      const userData = await User.findOne({
        _id: user.user_id,
        deleted_at: "Null",
      });

      if (userData.profile.length > 0) {
        //render Profile data on a Page - button to edit
        return res.send({
          status: "found",
          message: "Your profile is available already",
          userData,
        });
      }

      // render a Form to create Profile.
      return res
        .json({ status: "notfound", message: "Please create your Profile" })
        .render("components/profile-create");
    }
  } catch (err) {
    return res.json({ status: "error", message: "We caught an error" });
  }
});

// upload image
userRoute.post("/upload-image", uploadImage);

userRoute.post(
  "/create-profile",
  auth,
  [
    check("full_name", "Please enter your name").not().isEmpty(),
    check("gender", "Please Select your Gender").not().isEmpty(),
    check("dob", "Enter Date of Birth.").not().isDate(),
    check("education", "Fill your educational qualification").not().isEmpty(),
    check("about_me", "Let us know more, say a few words about you")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.json({ status: "failure", message: "User not logged in." });
      }
      const { avatar } = req.file;
      const { full_name, gender, dob, education, website, about_me } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ status: "error", errors: errors.array() });
      }

      const createProfile = await User.updateOne(
        { _id: user.user_id, deleted_at: "Null" },
        {
          $addToSet: {
            profile: {
              $set: {
                profile_pic: req.file.path,
                full_name: full_name[0],
                gender: gender,
                dob: dob,
                education: education,
                website: website,
                about_me: about_me,
              },
            },
          },
        },
        (e, data) => {
          if (e) {
            return res.json({ status: "failure", e });
          } else if (data.modifiedCount == 1) {
            // console.log('Done')
            return res.json({
              status: "success",
              message: "Your Profile updated",
            });
          } else {
            return res.json({ status: "failure", message: "Process failed" });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

//edit Profile
userRoute.get("/update-profile", auth, async (req, res) => {
  try {
    const user = req.user;
    const profileData = await User.findOne({
      _id: user.user_id,
      deleted_at: "Null",
    });

    if (!profileData) {
      return res.json({ status: "failure", message: "Profile not found." });
    }
    // form with data
    return res.json({
      status: "success",
      message: "Showing your Profile data in a Edit Form",
      profileData: profileData,
    });
  } catch (err) {
    console.log(err);
  }
});

userRoute.put(
  "/update-profile",
  auth,
  [
    check("full_name", "Please enter your name").not().isEmpty(),
    check("gender", "Please Select your Gender").not().isEmpty(),
    check("dob", "Enter Date of Birth.").not().isDate(),
    check("education", "Fill your educational qualification").not().isEmpty(),
    check("about_me", "Let us know more, say a few words about you")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.json({ status: "failure", message: "User not logged in." });
      }

      const { full_name, gender, dob, education, website, about_me } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({ status: "error", error: errors.array() });
      }

      const updateProfile = await User.updateOne(
        { _id: user.user_id, deleted_at: "Null" },
        {
          $set: {
            full_name: full_name,
            gender: gender,
            dob: dob,
            education: education,
            website: website,
            about_me: about_me,
          },
        }
      );
      if (updateProfile) {
        return res.json({
          status: "success",
          message: "Profile updated.",
          updateProfile,
        });
      }
      return res.json({ status: "failure", message: "Profile update failed." });
    } catch (err) {
      console.log(err);
    }
  }
);

// Password Reset
userRoute.put(
  "/reset-password",
  auth,
  [
    check(
      "new_pwd",
      "Password must be 8 characters in length and should contain special characters as well."
    )
      .isLength({ min: 8 })
      .not()
      .isLowercase()
      .not()
      .isUppercase()
      .not()
      .isNumeric()
      .not()
      .isAlpha(),
  ],
  async (req, res) => {
    try {
      const { new_pwd, newMatch_pwd } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = req.user;
      if (user) {
        if (new_pwd == newMatch_pwd) {
          const hasedNew = bcrypt.hashSync(new_pwd, 10);
          const changePwd = await User.updateOne(
            { _id: user.user_id },
            { $set: { password: hasedNew } }
          );
          if (changePwd) {
            return res.json({
              status: "success",
              msg: "Password changed successfully.",
            });
          }
          return res.json({
            status: "failure",
            msg: "Couldnt update the password at the moment.",
          });
        }
        return res.json({
          status: "failure",
          msg: "New Password doesnt match with confirm password.",
        });
      }
      return res.json({ status: "failure", msg: "Please login", user });
    } catch (err) {
      return res.json({ status: "error", message: "We caught an error" });
    }
  }
);

// Performing logout Operation
userRoute.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      user.exp = user.iat;
      return res.json({ status: "success", msg: "Logged out." });
    }
    return res.json({ status: "failure", msg: "You are not logged in." });
  } catch (err) {
    return res.json({ status: "error", message: "We caught an error" });
  }
});

module.exports = userRoute;
