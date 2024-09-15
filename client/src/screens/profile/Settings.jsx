import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../redux/apis/authApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import UserAvatar from "../../Components/Avatar";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [updateUser] = useUpdateUserMutation();
  const currentUser = useSelector((state) => state.Authentication.userData);
  const [hover, setHover] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: currentUser?.bio || "",
      age: currentUser?.creatorInfo?.age || "",
      phone: currentUser?.creatorInfo?.phone || "",
      address: currentUser?.creatorInfo?.address || "",
      social: {
        twitter: currentUser?.creatorInfo?.social?.twitter || "",
        github: currentUser?.creatorInfo?.social?.github || "",
        linkedin: currentUser?.creatorInfo?.social?.linkedin || "",
        instagram: currentUser?.creatorInfo?.social?.instagram || "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("bio", data.bio);
      formData.append("age", data.age);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("twitter", data.social.twitter);
      formData.append("github", data.social.github);
      formData.append("linkedin", data.social.linkedin);
      formData.append("instagram", data.social.instagram);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
      navigate(`/profile/${currentUser._id}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Error updating profile.");
    }
  };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  return (
    <div className="w-full mx-auto mt-8 max-[840px]:mt-0">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col min-[840px]:flex-row gap-6 md:gap-0 max-h-[550px] ">
          <div className="w-full min-[840px]:w-1/3 flex items-center justify-center border bg-gray-100 py-6 ">
            <div className="flex flex-col items-center gap-3">
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shadow-md"
              >
                <UserAvatar
                  image={currentUser?.avatar?.url}
                  name={currentUser?.name}
                  avatarSize="w-full h-full"
                  spanSize="text-6xl"
                />
                {hover && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Change
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <h3 className="text-xl">{currentUser?.name}</h3>
            </div>
          </div>

          <div className="w-full min-[840px]:w-2/3  md:border-t border-b border-r py-8 overflow-y-scroll ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-lg mx-auto max-[550px]:w-[400px] max-[400px]:w-[350px]"
            >
              <Input
                label="Bio"
                register={register("bio")}
                error={errors.bio?.message}
              />
              {(currentUser?.role === "Creator" ||
                currentUser?.role === "Admin") && (
                <>
                  <Input
                    label="Age"
                    type="number"
                    register={register("age", { valueAsNumber: true })}
                    error={errors.age?.message}
                  />
                  <Input
                    label="Phone"
                    register={register("phone")}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Address"
                    register={register("address")}
                    error={errors.address?.message}
                  />

                  <Input
                    label="Twitter"
                    register={register("social.twitter")}
                    error={errors.social?.twitter?.message}
                  />
                  <Input
                    label="GitHub"
                    register={register("social.github")}
                    error={errors.social?.github?.message}
                  />
                  <Input
                    label="LinkedIn"
                    register={register("social.linkedin")}
                    error={errors.social?.linkedin?.message}
                  />
                  <Input
                    label="Instagram"
                    register={register("social.instagram")}
                    error={errors.social?.instagram?.message}
                  />
                </>
              )}
              <div className="flex justify-between pt-3">
                <button
                  type="reset"
                  className="w-1/3 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 transition-all duration-300"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="w-1/3 bg-gray-900 text-white py-2 px-4 rounded hover:bg-black transition-all duration-300"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
