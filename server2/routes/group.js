import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createGroup, joinGroup, leaveGroup } from "../controllers/group.js";

router.post("/creategroup", createGroup);
router.post("/joingroup", joinGroup);
router.post("/leaveGroup", leaveGroup);


export default router;