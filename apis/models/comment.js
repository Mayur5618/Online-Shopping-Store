import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comments", commentSchema);

export default commentModel;
