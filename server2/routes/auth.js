import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { register, login, refreshToken } from "../controllers/auth.js";

router.post("/login", login);
router.post("/register", register);
router.post("/refreshtoken", refreshToken);

export default router;