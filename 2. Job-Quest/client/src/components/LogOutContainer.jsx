import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import Wrapper from "../assets/wrappers/LogoutContainer";
import { useState } from "react";
import { useDashboardContext } from "../pages/DashboardLayout";

const LogOutContainer = () => {
  const { user, logOutUser } = useDashboardContext();
  const [showLogOut, setShowLogOut] = useState(false);

  const logoutHandler = () => {
    setShowLogOut(!showLogOut);
  };

  return (
    <Wrapper>
      <button type="button" className="btn logout-btn" onClick={logoutHandler}>
        <FaUserCircle />
        {user?.name ?? "Abhay"}
        <FaCaretDown />
      </button>
      <div className={showLogOut ? "dropdown show-dropdown" : "dropdown"}>
        <button type="button" className="dropdown-btn" onClick={{ logOutUser }}>
          LogOut
        </button>
      </div>
    </Wrapper>
  );
};

export default LogOutContainer;
