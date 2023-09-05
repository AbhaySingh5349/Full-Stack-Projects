/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import Wrapper from "../assets/wrappers/Dashboard";
import { BigSideBar, NavBar, SmallSideBar } from "../components";

import { checkDefaultTheme } from "../App";

// whatever values we pass in context will be accessible to all sub-components
const DashboardContext = createContext();

const DashBoardLayout = () => {
  const user = { name: "abhay" };
  const [showSideBar, setShowSideBar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);

    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("dark-theme", newDarkTheme);
  };

  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  const logOutUser = async () => {
    console.log("logout user: ", user);
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSideBar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSideBar,
        logOutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSideBar />
          <BigSideBar />
          <div>
            <NavBar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashBoardLayout;
