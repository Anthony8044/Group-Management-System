import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getStudent, getAllStudents, updateStudent } from "../controllers/student.js";

router.get("/getstudent/:id", getStudent);
router.get("/getallstudents", getAllStudents);
router.patch("/updatestudent/:id", updateStudent);

export default router;