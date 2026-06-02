
import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser ,updateProfile } from "../controller/userController.js";
import multer from "multer";
import User from "../model/userModel.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/getcurrentuser", isAuth, getCurrentUser);

router.post("/profile", isAuth, upload.single("photo"), updateProfile);

export default router;