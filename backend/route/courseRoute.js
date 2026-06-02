import express from "express";
import { createCourse, getPublishedCourses, getCreatorCourses, editCourse, getCourseById, removeCourse, getCreatorById } from "../controller/courseController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createLecture, getCourseLectures, editLecture, removeLecture } from "../controller/courseController.js";
import { searchWithAi } from "../controller/searchController.js";

const courseRouter = express.Router();

// For Courses
courseRouter.post("/create",isAuth, createCourse);
courseRouter.get("/getpublished", getPublishedCourses);
courseRouter.get("/getcreator",isAuth, getCreatorCourses);
courseRouter.post("/editcourse/:courseid", isAuth, upload.single('thumbnail'), editCourse);
courseRouter.get("/getcourse/:courseid", isAuth, getCourseById);
courseRouter.delete("/remove/:courseid", isAuth, removeCourse);


// For Lectures
courseRouter.post("/createlecture/:courseId", isAuth, createLecture);
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLectures);
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture);
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture);
courseRouter.post("/creator", isAuth, getCreatorById);

// For Search
courseRouter.post("/search", searchWithAi);

export default courseRouter;