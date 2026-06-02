import Course from '../model/courseModel.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import Lecture from '../model/lectureModel.js';
import User from '../model/userModel.js';
import Review from '../model/reviewModel.js';

export const createCourse = async (req, res) => {
    try {
        const { title, subTitle, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: 'Title and category are required' });
        }
        const course = await Course.create({
            title,
            subTitle,
            category,
            creator: req.userId
        });
        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error ${error}` });
    }
};

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews")
        if (!courses) {
            return res.status(404).json({ message: 'No published courses found' });
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to find published courses ${error}` });
    }
};

export const  getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId }); 
        if (!courses) {
            return res.status(404).json({ message: 'No courses found for this creator' });
        }
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to find creator's courses ${error}` });
    }
}

export const editCourse = async (req, res) => {
    try {
        const {courseid} = req.params;
        const { title, subTitle, description, category, level, isPublished, price } = req.body;
        let thumbnail
        if (req.file) {
            try{
            thumbnail = await uploadOnCloudinary(req.file.path)
        }catch(error){
            return res.status(500).json({ message: `Failed to upload thumbnail ${error}` });
        }
    }
        let course = await Course.findById(courseid); 
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const updateData = {title, subTitle, description, category, level, isPublished, price, thumbnail };
        course = await Course.findByIdAndUpdate(courseid, updateData, { new: true });
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit course ${error}` });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const {courseid} = req.params;
        let course = await Course.findById(courseid)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course by ID ${error}` });
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseid } = req.params;
        const course = await Course.findById(courseid);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        await Review.deleteMany({
            course: courseid
        });
        if (course.lectures && course.lectures.length > 0) {
            await Lecture.deleteMany({
                _id: { $in: course.lectures }
            });
        }
        await Course.findByIdAndDelete(courseid);
        return res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Failed to remove course ${error}`
        });
    }
}

// For Lecture

export const createLecture = async (req, res) => {
    try{
        const {lectureTitle} = req.body;
        const {courseId} = req.params;
        if(!lectureTitle || !courseId){
            return res.status(400).json({message: 'Lecture title is required'})
        }
        const lecture = await Lecture.create({lectureTitle})
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
        }
        course.populate('lectures')
        await course.save();
        return res.status(201).json({lecture, course});
    }catch(error){
        return res.status(500).json({message: `Failed to create lecture ${error}`});
    }
}

export const getCourseLectures = async (req, res) => {
    try{
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({message: 'Course not found'})
        }
        return res.status(200).json({ lectures: course.lectures });
    }catch(error){
        return res.status(500).json({message: `Failed to get course lectures ${error}`});
    }
}

export const editLecture = async (req, res) => {
    try{
        const {lectureId} = req.params;
        const {isPreviewFree, lectureTitle} = req.body;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({message: 'Lecture not found'})
        }
        let videoUrl
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle;
        }
        lecture.isPreviewFree = isPreviewFree;
        await lecture.save();
        return res.status(200).json(lecture);
    }catch(error){
        return res.status(500).json({message: `Failed to edit lecture ${error}`});
    }
}

export const removeLecture = async (req, res) => {
    try{
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({message: 'Lecture not found'})
        }
        await Course.updateMany(
            {lectures: lectureId}, 
            {$pull: {lectures: lectureId}}
        );
        return res.status(200).json({message: 'Lecture removed successfully'});
    }catch(error){
        return res.status(500).json({message: `Failed to remove lecture ${error}`});
    }
}

// Get Creator

export const getCreatorById = async (req, res) => {
    try{
        const {userId} = req.body
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        return res.status(200).json(user);
    }catch(error){
        return res.status(500).json({message: `Failed to get creator ${error}`});
    }
}