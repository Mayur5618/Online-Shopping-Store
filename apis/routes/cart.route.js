import express from 'express';
import { addToCart,deleteCart,getCartItems, updateQuantity } from '../controllers/cart.controller.js'
import { verify } from '../utillitis/verify.js';

const router=express.Router();

router.post("/addToCart",verify,addToCart);
router.get("/getCartItems",verify,getCartItems);
router.put("/updateQuantity",verify,updateQuantity);
router.delete("/delete/:id",verify,deleteCart);

export default router;