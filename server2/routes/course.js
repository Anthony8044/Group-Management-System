import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createCourse, registerCourse, getAllCourses, getCourse, getCourseFull } from "../controllers/course.js";

router.post("/createCourse", createCourse);
router.post("/registerCourse", registerCourse);
router.get("/getCourse/:id", getCourse);
router.get("/getCourseFull/:id", getCourseFull);
router.get("/getAllCourses", getAllCourses);



export default router;