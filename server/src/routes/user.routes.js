import express from "express";
import { singleFile } from "../middlewares/upload.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMe,
  deleteMe,
  requestCreatorRole,
} from "../controllers/user.controller.js";
import { requestCreatorRoleValidator, validate } from "../lib/validator.js";

const router = express.Router();

router.use(protect);

router.patch("/updateMe", singleFile("avatar"), updateMe);
router.get("/me", getMyProfile);
router.patch("/deleteMe", deleteMe);
router.post(
  "/promote-to-creator",
  requestCreatorRoleValidator(),
  validate,
  requestCreatorRole
);

export default router;
