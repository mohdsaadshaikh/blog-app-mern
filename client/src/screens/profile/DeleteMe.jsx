import { toast } from "react-toastify";
import { useDeleteMeMutation } from "../../redux/apis/authApi";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useEffect } from "react";

const DeleteMe = () => {
  const [deleteMe] = useDeleteMeMutation();
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await deleteMe();
      toast.success(
        "Your account has been temporarily deleted. You have 15 days to log back in, otherwise your account will be permanently deleted."
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete account");
    }
  };

  const confirm2 = () => {
    confirmDialog({
      message: "Do you really want to delete your account?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger bg-red-500 py-2 px-4 text-white ml-2",
      rejectClassName: "bg-black py-2 px-4 text-white ",
      accept: deleteHandler,
      reject: () => {
        navigate("/");
      },
    });
  };

  useEffect(() => {
    confirm2();
  }, []);

  return <ConfirmDialog />;
};

export default DeleteMe;
