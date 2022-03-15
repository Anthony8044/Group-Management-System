import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createproject, getAllProjects } from "../controllers/project.js";

router.post("/createproject", createproject);
router.get("/getAllProjects", getAllProjects);


export default router;