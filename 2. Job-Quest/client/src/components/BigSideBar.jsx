import Wrapper from "../assets/wrappers/BigSidebar";

import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const BigSideBar = () => {
  const { showSideBar } = useDashboardContext();

  return (
    <Wrapper>
      <div className={`sidebar-container ${showSideBar ? "" : "show-sidebar"}`}>
        <header>
          <Logo />
        </header>
        <NavLinks isBigSideBar />
      </div>
    </Wrapper>
  );
};

export default BigSideBar;
