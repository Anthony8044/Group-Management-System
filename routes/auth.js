import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { registerStudent, registerTeacher, login, refreshToken } from "../controllers/auth.js";

router.post("/login", login);
router.post("/registerStudent", registerStudent);
router.post("/registerTeacher", registerTeacher);
router.post("/refreshtoken", refreshToken);

export default router;