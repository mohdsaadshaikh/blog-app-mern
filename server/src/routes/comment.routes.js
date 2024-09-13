import { Router } from "express";
import {
  getAllComments,
  getOneComment,
  createComment,
  updateComment,
  deleteComment,
  setBlogAndUserId,
  likeOnComment,
  replyToComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

router.use(protect);

router.route("/").get(getAllComments).post(setBlogAndUserId, createComment);

router
  .route("/:commentId")
  .get(getOneComment)
  .patch(updateComment)
  .delete(deleteComment);

router.route("/:commentId/react").patch(likeOnComment);
router.route("/:commentId/reply").patch(replyToComment);

export default router;
