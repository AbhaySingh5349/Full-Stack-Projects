import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/SmallSidebar";

import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const SmallSideBar = () => {
  const { showSideBar, toggleSideBar } = useDashboardContext();
  // console.log("showSideBar: ", showSideBar);

  return (
    <Wrapper>
      <div className={`sidebar-container ${showSideBar ? "show-sidebar" : ""}`}>
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSideBar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSideBar;
