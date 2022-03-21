import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createproject, getAllProjects, getProjectsByCourseId, getProject } from "../controllers/project.js";

router.get("/getAllProjects", getAllProjects);
router.get("/getProject/:id", getProject);
router.get("/getProjectsByCourseId/:id", getProjectsByCourseId);
router.post("/createproject", createproject);


export default router;