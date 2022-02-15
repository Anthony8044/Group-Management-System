import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { registerCourse, getCourseUsers, getUserCourses, getAllUserCourse } from "../controllers/course.js";

router.post("/registerCourse", registerCourse);
router.post("/getCourse", getCourseUsers);
router.post("/getCourses", getUserCourses);
router.get("/getallusercourse", getAllUserCourse);


export default router;