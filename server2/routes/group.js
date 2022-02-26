import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createGroup, joinGroup } from "../controllers/group.js";

router.post("/creategroup", createGroup);
router.post("/joingroup", joinGroup);


export default router;