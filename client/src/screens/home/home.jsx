import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Menu } from "primereact/menu";
import Logo from "../../Components/Logo";
import { Button } from "primereact/button";

const HomePage = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Our story",
      command: () => {
        navigate("/story");
      },
    },
    {
      label: "Membership",
      command: () => {
        navigate("/membership");
      },
    },
    {
      label: "Write",
      command: () => {
        navigate("/auth");
      },
    },
    {
      label: "Sign in",
      command: () => {
        navigate("/auth");
      },
    },
    {
      label: "Get started",
      command: () => {
        navigate("/auth");
      },
    },
  ];
  return (
    <div className="bg-[#f7f6f3] min-h-screen flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 bg-transparent max-sm:px-3">
        <Logo />
        <div className="md:hidden">
          <Button
            icon="pi pi-bars"
            className="p-button-text"
            onClick={(e) => menuRef.current.toggle(e)}
          />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a href="#our-story" className="text-gray-800 hover:underline">
            Our story
          </a>
          <a href="#membership" className="text-gray-800 hover:underline">
            Membership
          </a>
          <Link to="/auth" className="text-gray-800 hover:underline">
            Write
          </Link>
          <Link to="/auth" className="text-gray-800 hover:underline">
            Sign in
          </Link>
          <Link
            to="/auth"
            className="ml-4 bg-black text-white px-4 py-2 rounded-full"
          >
            Get started
          </Link>
        </div>
        <Menu model={menuItems} popup ref={menuRef} />
      </nav>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-9xl max-md:text-8xl max-sm:text-7xl font-bold mb-4 font-home-heading">
          {/* Human stories <br /> & ideas */}
          Discover Tech <br /> Tomorrow
        </h1>
        <p className="text-xl text-gray-950 mb-6">
          {/* A place to read, write, and deepen your understanding */}
          Explore Ideas, Share Stories, and Deepen Knowledge
        </p>
        <Link
          to="/auth"
          className="bg-black text-white px-8 py-2 rounded-full "
        >
          Start reading
        </Link>
      </main>

      <footer className="bg-transparent py-4 text-center text-gray-500 border-t border-gray-400 mt-auto">
        <div className="flex justify-center space-x-4 max-sm:text-sm">
          <a
            className="hover:underline hover:text-black transition-all"
            href="#help"
          >
            Help
          </a>
          <a
            className="hover:underline hover:text-black transition-all"
            href="#status"
          >
            Status
          </a>
          <a
            className="hover:underline hover:text-black transition-all"
            href="#about"
          >
            About
          </a>
          <a
            className="hover:underline hover:text-black transition-all"
            href="#careers"
          >
            Careers
          </a>
          <a
            className="hover:underline hover:text-black transition-all"
            href="#privacy"
          >
            Privacy
          </a>
          <a
            className="hover:underline hover:text-black transition-all"
            href="#terms"
          >
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
