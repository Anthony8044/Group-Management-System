import express from "express";
const router = express.Router();
import authorization from "../middleware/authorization.js";
import { register, login, registerCourse } from "../controllers/users.js";

router.post("/login", login);
router.post("/register", register);
router.post("/registerCourse", registerCourse);

export default router;