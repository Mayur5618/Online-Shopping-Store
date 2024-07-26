import { deleteAcc, deleteUser, getUser, getUsers, signOut, test, updateUser } from '../controllers/user.controller.js';
import express from 'express';
import {verify} from "../utillitis/verify.js"

const router=express.Router();

router.get("/test",verify,test);
router.put("/updateUser/:userid",verify,updateUser);
router.post("/sign-out",signOut);
router.delete("/delete/:userid",verify,deleteAcc);
router.get("/getUsers",verify,getUsers);
router.delete("/deleteUser/:userId",verify,deleteUser);
router.get("/getUser/:userId",getUser);

export default router;