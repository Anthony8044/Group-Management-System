import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getStudent, getAllStudents, updateStudent, getSectionStudents, getStudentGroups, getStudentTable } from "../controllers/student.js";

router.get("/getstudent/:id", getStudent);
// router.get("/getStudentinProject/:id/:projid", getStudentinProject);
router.get("/getStudentGroups/:id", getStudentGroups);
router.get("/getStudentTable/:id", getStudentTable);
router.get("/getSectionStudents/:id", getSectionStudents);
router.get("/getallstudents", getAllStudents);
router.patch("/updatestudent/:id", updateStudent);

export default router;