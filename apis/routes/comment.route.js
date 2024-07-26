import express from 'express';
const router=express.Router();
import {addLike, create, deleteComment, edit, getComments, getProductComments, } from '../controllers/comment.controller.js';
import { verify } from '../utillitis/verify.js';

router.post("/create/:productId",verify,create);
router.put("/addLike/:commentId",verify,addLike);
router.get("/getComments/:productId",getProductComments);
router.put("/edit/:commentId/",verify,edit);
router.delete("/delete/:commentId",verify,deleteComment);
router.get("/getComments",verify,getComments);

export default router;