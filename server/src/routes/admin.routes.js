import express from "express";
import { handleRole } from "../controllers/admin.controller.js";

const router = express.Router();

router.patch("/handle-user-role/:requestId", handleRole);

export default router;
