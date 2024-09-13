import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

const Layout = () => {
  return (
    <>
      <header>
        <Header />
      </header>

      <main className="w-[100vw] h-full">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
