import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getTeacher, getAllTeachers, updateTeacher } from "../controllers/teacher.js";

router.get("/getTeacher/:id", getTeacher);
router.get("/getallteachers", getAllTeachers);
router.patch("/updateteacher/:id", updateTeacher);

export default router;