import commentModel from "../models/comment.js";
import { errorHandler } from "../utillitis/errorHandler.js";

export const create = async (req, res, next) => {
  const { productId } = req.params;
  const { content, star } = req.body;

  try {
    const newComment = new commentModel({
      productId,
      userId: req.user.id,
      content,
      star,
    });
    const data = await newComment.save();
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

export const addLike = async (req, res, next) => {
  try {
    const findComment = await commentModel.findById(req.params.commentId);
    if (!findComment) {
      res.status(404, "comment not found..");
    }

    if (findComment.likes.indexOf(req.user.id) === -1) {
      findComment.likes.push(req.user.id);
      findComment.numberOfLikes += 1;
    } else {
      findComment.likes.splice(findComment.likes.indexOf(req.user.id), 1); //first arg:arr index to delete ,second:number of ele after index to delete
      findComment.numberOfLikes -= 1;
    }
    findComment.save();
    res.status(200).json(findComment);
  } catch (error) {
    next(error);
  }
};

export const getProductComments = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const fetchedComments = await commentModel
      .find({ productId })
      .sort({ updatedAt: -1 });

    if (fetchedComments.length === 0) {
      return res.status(200).json("There are no comments yet!");
    }
    return res.status(200).json(fetchedComments);
  } catch (error) {
    next(error);
  }
};

export const edit = async (req, res, next) => {
  const { commentId } = req.params;
  const { content, star } = req.body;

  const fetchComment = await commentModel.findById({ _id: commentId });
  if (!fetchComment) {
    return next(errorHandler(404, "comment does not found..."));
  }
  if (fetchComment.userId !== req.user.id) {
    return next(
      errorHandler(401, "You are not allowed to edit this comment...")
    );
  }
  try {
    const updatedComment = await commentModel.findByIdAndUpdate(
      { _id: commentId },
      {
        $set: {
          content,
          star,
        },
      },
      { new: true }
    );
    res.status(200).json({ data: updatedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  if (!req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  if (req.user.id || req.user.isAdmin) {
    try {
      await commentModel.findByIdAndDelete({
        _id: commentId,
      });
      res.status(200).json("Comment has been deleted..");
    } catch (error) {
      next(error);
    }
  }
};

export const getComments = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 7;
  const startIndex = parseInt(req.query.startIndex) || 0;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  if (req.user.isAdmin) {
    try {
      const comments = await commentModel
        .find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .populate("productId");

      const totalComments = await commentModel.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );

      const lastMonthComments = await commentModel.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      next(error);
    }
  }
};
