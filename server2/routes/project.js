import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createproject } from "../controllers/project.js";

router.post("/createproject", createproject);


export default router;