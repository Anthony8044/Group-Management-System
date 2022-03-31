import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createGroup, joinGroup, leaveGroup, invite, acceptInvite, rejectInvite, getStudentInvite } from "../controllers/group.js";

router.post("/creategroup", createGroup);
router.post("/joingroup", joinGroup);
router.post("/leaveGroup", leaveGroup);
router.post("/invite", invite);
router.post("/acceptInvite", acceptInvite);
router.post("/rejectInvite", rejectInvite);
router.get("/getStudentInvite/:id", getStudentInvite);


export default router;