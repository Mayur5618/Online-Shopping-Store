import { errorHandler } from "../utillitis/errorHandler.js";
import bcyptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res, next) => {
  res.json("Hello,Do your best..");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userid) {
    res.json(req.user.id, req.params.userid);
    return next(
      errorHandler(401, "you are not allowed to update this user data")
    );
  }
  if (req.body.username) {
    if (req.body.username.length > 20 || req.body.username.length < 7) {
      return next(
        errorHandler(401, "username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(401, "username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "username must be in lowercase"));
    }
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must conation min 6 character"));
    }
    req.body.password = bcyptjs.hashSync(req.body.password, 10);
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userid,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          photoUrl: req.body.photoUrl,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  res
    .status(200)
    .clearCookie("access_token")
    .json({ message: "Sign-out succeful..", ok: true });
};

export const deleteAcc = async (req, res, next) => {
  if (req.user.id !== req.params.userid) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json("Account deleted...");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Unauthorized"));
  }
  try {
    const users = await User.find({}).skip(startIndex).limit(limit);
    const filterUsersArr = [];

    users.map((user) => {
      const { password, ...rest } = user._doc;
      filterUsersArr.push(rest);
    });

    const totalUsers = await User.countDocuments();

    const today = new Date();

    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ filterUsersArr, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      next(errorHandler(404, "user not found"));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
