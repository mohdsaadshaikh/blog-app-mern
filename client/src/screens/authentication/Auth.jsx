import { FileUpload } from "primereact/fileupload";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../Components/Input";
import Logo from "../../Components/Logo";
import PasswordInput from "../../Components/PasswordInput";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../../redux/apis/authApi";
import { setAuthenticated } from "../../redux/slices/authentication";

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegisteringUser }] =
    useRegisterUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (isRegistering) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

        if (selectedAvatar) {
          formData.append("avatar", selectedAvatar);
        }

        await registerUser(formData).unwrap();
        toast.success(
          "Registration successful! We've sent you a registration email."
        );
        setIsRegistering(false);
      } else {
        await loginUser(data).unwrap();
        toast.success("Login successful!");
        dispatch(setAuthenticated());
      }
      navigate("/");
      reset();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onAvatarSelect = (e) => {
    setSelectedAvatar(e.files[0]);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col justify-center items-center sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo />
        <h2 className="mt-5 text-center text-2xl leading-9 tracking-tight text-black">
          {isRegistering ? "Create your account" : "Login to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            register={register("email", { required: "Email is required" })}
            error={errors.email?.message}
            className="w-full border-gray-500 "
          />
          <PasswordInput
            label="Password"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            error={errors.password?.message}
          />
          {isRegistering && (
            <>
              <Input
                label="Name"
                type="text"
                register={register("name", {
                  required: "Name is required",
                })}
                error={errors.name?.message}
                className="w-full  border-gray-500 "
              />

              <div className="file-upload-container">
                <FileUpload
                  mode="basic"
                  accept="image/*"
                  className="custom-file-upload"
                  uploadLabel="Upload"
                  onSelect={onAvatarSelect}
                  auto={false}
                  chooseOptions={{
                    label: "Upload Avatar",
                    icon: "pi pi-fw pi-images",
                  }}
                  customUpload
                  uploadHandler={onAvatarSelect}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isRegistering ? isRegisteringUser : isLoggingIn}
            className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 disabled:opacity-50"
          >
            {isRegistering
              ? isRegisteringUser
                ? "Registering..."
                : "Register"
              : isLoggingIn
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
        {errors.password && !isRegistering && (
          <div className="text-right mt-2 ">
            <Link to="/forgot-password">
              <span className="hover:underline text-purple-800 text-base">
                Forgot Password?
              </span>
            </Link>
          </div>
        )}
        <p
          className="text-black cursor-pointer text-center mt-4"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <span className="hover:underline">Login here</span>
            </>
          ) : (
            <>
              Dont have an account?{" "}
              <span className="hover:underline">Register here</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
