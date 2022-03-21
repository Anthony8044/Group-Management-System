import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getStudent, getAllStudents, updateStudent, getSectionStudents } from "../controllers/student.js";

router.get("/getstudent/:id", getStudent);
router.get("/getSectionStudents/:id", getSectionStudents);
router.get("/getallstudents", getAllStudents);
router.patch("/updatestudent/:id", updateStudent);

export default router;