/* eslint-disable */
import { useState, useEffect } from "react";
import { SplitButton } from "primereact/splitbutton";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useReplyCommentMutation,
} from "../redux/apis/commentApi";
import { toast } from "react-toastify";
import UserAvatar from "./Avatar";
import { useDebouncedCallback } from "use-debounce";

const CommentBox = ({ blogId, commentsData, refetch }) => {
  const [replyText, setReplyText] = useState("");
  const [visibleReply, setVisibleReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const currentUser = useSelector((state) => state.Authentication.userData);

  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [replyComment, { isLoading }] = useReplyCommentMutation();
  const [likeComment] = useLikeCommentMutation();

  // const handleLikeComment = async (commentId) => {
  //   try {
  //     await likeComment({ blogId, commentId }).unwrap();
  //     // refetch();
  //   } catch (error) {
  //     console.error("Failed to like the comment:", error);
  //   }
  // };

  console.log(commentsData);

  const handleLikeComment = useDebouncedCallback(async (commentId) => {
    try {
      const res = await likeComment({ blogId, commentId }).unwrap();
      setIsLiked(res?.isLiked);
      setLikesCount(res?.likes?.length);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Error while liking Comment");
    }
  });

  useEffect(() => {
    if (commentsData?.likes) {
      setIsLiked(commentsData.likes.includes(currentUser._id));
      setLikesCount(commentsData.likes.length);
    }
  }, [commentsData, currentUser]);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ blogId, commentId });
      toast.success("Comment deleted successfully");
      await refetch();
    } catch (error) {
      console.error("Failed to delete the comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      await replyComment({
        blogId,
        commentId,
        reply: replyText,
      });
      await refetch();
      setVisibleReply(false);
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const items = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => console.log(`Editing comment: ${commentsData._id}`),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => handleDeleteComment(commentsData._id),
    },
  ];

  return (
    <div className="flex gap-2 flex-col border-t pt-6 pb-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            <UserAvatar
              image={commentsData.user?.avatar?.url}
              name={commentsData.user?.name}
              avatarSize="w-full h-full"
              spanSize="text-base"
            />
          </div>
          {/* <img
            src={commentsData.user?.avatar?.url}
            alt={commentsData.user?.name}
            className="w-8 h-8 rounded-full object-cover"
          /> */}
          <div className="flex flex-col">
            <span className="text-black hover:underline cursor-pointer text-[15px]">
              {commentsData.user?.name}
            </span>
            <span className="text-gray-600 text-[13px]">
              {commentsData?.createdAt
                ? format(new Date(commentsData.createdAt), "MMM dd, yyyy")
                : ""}
            </span>
          </div>
        </div>
        {currentUser?._id === commentsData.user?._id && (
          <SplitButton dropdownIcon="pi pi-ellipsis-h" model={items} />
        )}
      </div>
      <div className="flex items-start gap-4">
        <p className="text-black text-sm">{commentsData.comment}</p>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => handleLikeComment(commentsData._id)}
          >
            <i
              className={`pi ${isLiked ? "pi-thumbs-up-fill" : "pi-thumbs-up"}`}
            ></i>
            <span>{likesCount}</span>
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => setShowReplies(!showReplies)}
          >
            <i className="pi pi-comment"></i>
            <span>
              {commentsData.replies?.length > 0 && showReplies
                ? "Hide Replies"
                : `${commentsData.replies?.length}`}
            </span>
          </div>
        </div>
        <span
          className="text-black hover:underline cursor-pointer"
          onClick={() => setVisibleReply(!visibleReply)}
        >
          reply
        </span>
      </div>

      {visibleReply && (
        <div className="mt-4">
          <div className="flex gap-2">
            <img
              src={currentUser?.avatar?.url || "default-avatar-url"}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                placeholder="Write a reply..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className={`py-1 px-3 bg-gray-800 text-white rounded text-sm cursor-pointer hover:bg-gray-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleReplySubmit(commentsData._id)}
              disabled={!replyText.trim() || isLoading}
            >
              {isLoading ? "Replying..." : "Reply"}
            </button>
          </div>
        </div>
      )}

      {showReplies && commentsData.replies?.length > 0 && (
        <div className="mt-4">
          {commentsData.replies.map((reply, index) => (
            <div key={index} className="ml-8 mt-2 border-l pl-4">
              <div className="flex items-start gap-4">
                <img
                  src={reply.user?.avatar?.url}
                  alt={reply.user?.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div>
                  <span className="text-sm font-bold">{reply.user?.name}</span>
                  <p className="text-gray-600 text-sm">{reply.reply}</p>
                  <span className="text-gray-500 text-xs">
                    {format(new Date(reply.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;
