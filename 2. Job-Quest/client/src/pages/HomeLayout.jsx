import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <>
      {/* to display child pages content and keeping home content same */}
      <Outlet />
    </>
  );
};

export default HomeLayout;
