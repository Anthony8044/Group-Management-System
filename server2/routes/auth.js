import express from "express";
const router = express.Router();
import authorization from "../middleware/authorization.js";
import { register, login } from "../controllers/users.js";

router.post("/login", login);
router.post("/register", register);

export default router;