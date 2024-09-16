import express from "express";
import { handleRole } from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch(
  "/handle-user-role/:requestId",
  protect,
  restrictTo("Admin"),
  handleRole
);

export default router;
