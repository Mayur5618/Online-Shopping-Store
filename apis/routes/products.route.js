import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller.js";
import { verify } from "../utillitis/verify.js";
import express from 'express';

const router=express.Router();

router.post("/create",verify,createProduct);
router.get("/getProducts",getProducts);
router.delete("/delete",verify,deleteProduct);
router.put("/updateProduct",verify,updateProduct);
router.get("/getProduct/:slug",getProduct);

export default router;