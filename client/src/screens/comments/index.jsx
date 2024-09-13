import { Sidebar } from "primereact/sidebar";
import CommentBox from "../../Components/CommentBox";
import { useCreateCommentMutation } from "../../redux/apis/commentApi";

const Comment = ({ visibleRight, setVisibleRight, data, blogId }) => {
  const [createComment] = useCreateCommentMutation();

  return (
    <Sidebar
      visible={visibleRight}
      position="right"
      onHide={() => setVisibleRight(false)}
      style={{ width: "400px" }}
    >
      <div className="flex flex-col w-full h-full gap-3">
        {data?.map((comment) => (
          <CommentBox
            key={comment._id}
            blogId={blogId}
            commentsData={comment}
          />
        ))}
      </div>
    </Sidebar>
  );
};

export default Comment;
