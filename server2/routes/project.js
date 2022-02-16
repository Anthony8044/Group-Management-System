import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { registerproject } from "../controllers/project.js";

router.post("/registerproject", registerproject);
// router.post("/getCourse", getCourseUsers);
// router.post("/getCourses", getUserCourses);
// router.get("/getAllStudentCourse", getAllStudentCourse);
// router.get("/getAllTeacherCourse", getAllTeacherCourse);


export default router;