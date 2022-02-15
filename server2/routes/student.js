import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { getStudent, getStudentParams, updateStudent } from "../controllers/student.js";

router.post("/getstudent", getStudent);
router.get("/getstudentp/:id", getStudentParams);
router.patch("/updatestudent/:id", updateStudent);

export default router;