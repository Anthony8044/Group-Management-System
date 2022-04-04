import express from "express";
const router = express.Router();
import { authorization } from "../middleware/authorization.js";
import { createGroup, joinGroup, leaveGroup, invite, acceptInvite, rejectInvite, getStudentInvite, getInviteSent } from "../controllers/group.js";

router.post("/creategroup", createGroup);
router.post("/joingroup", joinGroup);
router.post("/leaveGroup", leaveGroup);
router.post("/invite", invite);
router.post("/acceptInvite", acceptInvite);
router.delete("/rejectInvite", rejectInvite);
router.get("/getStudentInvite/:id", getStudentInvite);
router.get("/getInviteSent/:id", getInviteSent);


export default router;