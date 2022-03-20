import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createproject, getAllProjects, getProjectsByCourseId } from "../controllers/project.js";

router.get("/getAllProjects", getAllProjects);
router.get("/getProjectsByCourseId/:id", getProjectsByCourseId);
router.post("/createproject", createproject);


export default router;