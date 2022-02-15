import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { registerCourse, getCourseUsers, getUserCourses, getAllStudentCourse, getAllTeacherCourse } from "../controllers/course.js";

router.post("/registerCourse", registerCourse);
router.post("/getCourse", getCourseUsers);
router.post("/getCourses", getUserCourses);
router.get("/getAllStudentCourse", getAllStudentCourse);
router.get("/getAllTeacherCourse", getAllTeacherCourse);


export default router;