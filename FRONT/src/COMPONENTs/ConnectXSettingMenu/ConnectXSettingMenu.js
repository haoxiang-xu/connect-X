import React, { useEffect, useRef, useState, useContext } from "react";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";

import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;

/* SUB COMPONENTs ----------------------------------------------------------------- SUB COMPONENTs */
const SettingMenuPanel = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        height: "256px",
        width: "256px",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        transition: "0.24s",
      }}
    >
      <ThemeSwitch />
    </div>
  );
};
/* SUB COMPONENTs -------------------------------------------------------------------------------- */

const ConnectXSettingMenu = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        height: "100vh",
        width: "100vw",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        transition: "0.24s",
      }}
    >
      <SettingMenuPanel />
    </div>
  );
};

export default ConnectXSettingMenu;
