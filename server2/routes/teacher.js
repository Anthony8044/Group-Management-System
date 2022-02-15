import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getTeacher, getTeacherParams, updateTeacher } from "../controllers/teacher.js";

router.post("/getteacher", getTeacher);
router.get("/getteacherp/:id", getTeacherParams);
router.patch("/updateteacher/:id", updateTeacher);

export default router;