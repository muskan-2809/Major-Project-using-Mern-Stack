import express from "express"
import { signUp, login, logout, googleAuth } from "../controller/authController.js"
import { sendOTP, verifyOTP, resetPassword } from "../controller/authController.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/logout", logout)
router.post("/sendotp", sendOTP)
router.post("/verifyotp", verifyOTP)
router.post("/resetpassword", resetPassword)
router.post("/googleauth", googleAuth)

export default router
