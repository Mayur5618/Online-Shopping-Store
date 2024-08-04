import mongoose from "mongoose";
import productModel from "./product.model.js"; // Assuming you have a Product model defined

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  const cart = this;

  if (cart.isModified("quantity") || cart.isNew) {
    try {
      const product = await productModel.findById(cart.productId);
      if (!product) {
        throw new Error("Product not found");
      }
      cart.total =
        cart.quantity * parseInt(product.price.replace(/,/g, ""), 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const cartModel = mongoose.model("Carts", cartSchema);

export default cartModel;
