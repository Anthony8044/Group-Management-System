import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createproject, getAllProjects, getProjectsByCourseId, getProject, getProjectGroups } from "../controllers/project.js";

router.get("/getAllProjects", getAllProjects);
router.get("/getProject/:id", getProject);
router.get("/getProjectsByCourseId/:id", getProjectsByCourseId);
router.get("/getProjectGroups/:id/:course_id", getProjectGroups);
router.post("/createproject", createproject);


export default router;