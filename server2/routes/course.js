import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createCourse, registerCourse, getAllCourses} from "../controllers/course.js";

router.post("/createCourse", createCourse);
router.post("/registerCourse", registerCourse);
router.get("/getAllCourses", getAllCourses);



export default router;