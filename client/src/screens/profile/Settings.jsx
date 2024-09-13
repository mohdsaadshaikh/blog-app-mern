import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../redux/apis/authApi";

const Settings = () => {
  // Custom hook for API mutation
  const [updateUser] = useUpdateUserMutation();

  // React Hook Form hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      await updateUser(data).unwrap(); // Call the API mutation
      toast.success("Profile updated successfully!");
      reset(); // Reset form after submission
    } catch (error) {
      toast.error(error?.data?.message || "Error updating profile.");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">Update Your Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1">
            Name
          </label>
          <InputText
            id="name"
            {...register("name", { required: "Name is required" })}
            className={`w-full p-inputtext ${errors.name ? "p-invalid" : ""}`}
          />
          {errors.name && (
            <small className="p-error">{errors.name.message}</small>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="bio" className="mb-1">
            Bio
          </label>
          <InputText
            id="bio"
            {...register("bio")}
            className="w-full p-inputtext"
          />
        </div>

        {/* Add more fields as needed based on user role */}

        <Button
          label="Update Profile"
          icon="pi pi-check"
          type="submit"
          className="p-button p-button-primary"
        />
      </form>
    </div>
  );
};

export default Settings;
