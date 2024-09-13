import { useNavigate } from "react-router-dom";
import { useUpdatePasswordMutation } from "../../../redux/apis/authApi";
import { toast } from "react-toastify";
import PasswordInput from "../../../Components/PasswordInput";
import { useForm } from "react-hook-form";

const ChangePassword = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await updatePassword(data).unwrap();
      toast.success("Password updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Error updating password");
    }
  };

  return <div></div>;
};

export default ChangePassword;
