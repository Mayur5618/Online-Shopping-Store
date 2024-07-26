import express from 'express';
import { cookieCheck, google, signin, signup } from '../controllers/auth.controller.js';

const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get("/cookie",cookieCheck);

export default router;