import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { registerproject } from "../controllers/project.js";

router.post("/registerproject", registerproject);


export default router;