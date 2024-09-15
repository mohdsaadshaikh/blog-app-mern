import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Menubar } from "primereact/menubar";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "../redux/apis/authApi";
import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { setUnauthenticated } from "../redux/slices/authentication";
import { toast } from "react-toastify";
import UserAvatar from "./Avatar";

const Header = () => {
  const [logoutUser] = useLogoutUserMutation();
  const { data } = useGetUserProfileQuery();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTitle, setSearchTitle] = useState("");

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(setUnauthenticated());
      toast.success("User logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTitle(params.get("title") || "");
  }, [location.search]);

  const handleSearch = (e) => {
    setSearchTitle(e.target.value);
    if (e.key === "Enter") {
      navigate(`/?title=${e.target.value}`);
    }
  };

  const profileItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        navigate(`/profile/${data?.data?._id}`);
      },
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        navigate("/profile/Settings");
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: logoutHandler,
    },
    {
      label: data?.data?.name,
      className: "text-sm pt-2 border-t border-gray-300 unset",
    },
  ];

  const start = (
    <div className="flex items-center justify-center gap-6 max-sm:gap-3">
      <NavLink to="/">
        <h1 className="text-4xl font-bold-logo text-black">Blog</h1>
      </NavLink>
      <div className="relative">
        <i
          className={`pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600`}
          style={{ fontSize: "1rem" }}
        ></i>
        <InputText
          placeholder="Search"
          type="text"
          className="pl-10 w-[230px] max-[520px]:w-[200px] max-[490px]:w-[150px]  px-3 py-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-black placeholder:text-gray-60 sm:text-sm"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyPress={handleSearch}
        />
      </div>
    </div>
  );

  const end = (
    <div className="flex items-center gap-8 max-sm:gap-4">
      <div className="flex items-center gap-2">
        <NavLink to="/write">
          <div className="p-button-text flex items-center justify-center gap-1 text-opacity-50 p-button-plain">
            <i
              className="pi pi-pen-to-square"
              style={{ fontSize: "1.3rem", fontWeight: "lighter" }}
            ></i>
            <span>Write</span>
          </div>
        </NavLink>
      </div>
      <div
        onClick={(event) => menuRef.current.toggle(event)}
        className="w-[37px] h-[37px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
      >
        {/* <img
          src={data?.data?.avatar?.url || "person.png"}
          alt="Profile"
          className="w-full h-full object-cover"
        /> */}
        <UserAvatar
          image={data?.data?.avatar?.url}
          name={data?.data?.name}
          avatarSize="w-full h-full"
          spanSize="text-base"
        />
      </div>
      <Menu
        model={profileItems}
        popup
        ref={menuRef}
        id="profile_menu"
        className="mt-4"
      />
    </div>
  );

  return (
    <>
      <div className="card">
        <Menubar
          model={[]}
          start={start}
          end={end}
          className="px-6 bg-white border-gray-200 border-b"
        />
      </div>
    </>
  );
};

export default Header;
