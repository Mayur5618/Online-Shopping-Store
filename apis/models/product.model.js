import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    productPhotoUrl: {
      type: String,
      default:"https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
      required:"true"
    },
    subCategory: {
      type: String,
      default: "uncategorized",
    },
    price:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

const productModel=mongoose.model("Products",productSchema);

export default productModel;
