import { toast } from "react-toastify";
import { setUnauthenticated } from "../redux/slices/authentication";

export const onQueryStarted = async (args, { queryFulfilled, dispatch }) => {
  try {
    await queryFulfilled;
  } catch ({ error }) {
    const { status, data } = error;
    if (status === 400) {
      toast.error(data.message || "Bad Request");
    } else if (status === 401) {
      dispatch(setUnauthenticated());
      toast.warning(data.message || "Unauthorized");
    } else if (status === 404) {
      toast("Data not found");
    } else if (status === 500) {
      toast("Error from the server");
    } else {
      // toast("Something went wrong");
    }
  }
};
