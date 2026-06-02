import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createReview, getReviews } from "../controller/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/createrview", isAuth, createReview)
reviewRouter.get("/getreviews", getReviews)

export default reviewRouter