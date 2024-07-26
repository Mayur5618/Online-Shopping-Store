import cartModel from "../models/cart.model.js";

export const addToCart = async (req, res, next) => {
  const { productId } = req.body;
  try {
    let cartItem = await cartModel.findOne({ productId, userId: req.user.id });

    if (cartItem) {
      cartItem.quantity += 1;
      const updatedCartItem = await cartItem.save();
      return res.status(200).json(updatedCartItem);
    } else {
      const newCartItem = new cartModel({
        productId,
        quantity: 1,
        userId: req.user.id,
      });
      const savedCartItem = await newCartItem.save();
      return res.status(200).json(savedCartItem);
    }
  } catch (error) {
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const cartItems = await cartModel
      .find({ userId: req.user.id })
      .populate("productId");

    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
      res.status(200).json({ cartItems, totalCartItems });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  const { cartId, action } = req.body;
  try {
    const findProduct = await cartModel.findById(cartId).populate("productId");

    if (!findProduct) {
      return res.status(404).json({ message: "Product not found..." });
    }

    if (action === "remove") {
      if (findProduct.quantity > 1) {
        findProduct.quantity -= 1;
      } else {
        return res
          .status(400)
          .json({ message: "Cannot reduce quantity below 1" });
      }
    } else if (action === "add") {
      if (findProduct.quantity < 9) {
        findProduct.quantity += 1;
      } else {
        return res
          .status(400)
          .json({ message: "Cannot increase quantity above 9" });
      }
    } else {
      return res.status(400).json({ message: "Invalid action specified" });
    }

    const updatedCartItem = await findProduct.save();
    res.status(200).json(updatedCartItem);
  } catch (error) {
    next(error);
  }
};

export const deleteCart = async (req, res, next) => {
  const { id } = req.params;
  try {
    await cartModel.findByIdAndDelete(id);
    res.status(200).json("product has been removed from cart");
  } catch (error) {
    next(error);
  }
};
