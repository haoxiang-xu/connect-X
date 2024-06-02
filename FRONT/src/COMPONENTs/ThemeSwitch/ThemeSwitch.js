import React, { useEffect, useState } from "react";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";
import { ThemeSwitchContexts } from "../../CONTEXTs/ThemeSwitchContexts";

import { RiMoonFill, RiSunFill } from "@remixicon/react";

/* CONSTs --------------------------------------------------------------------------------------- CONSTs */
const SWITCH_DIMENSIONS = { height: 32, width: 50 };
const TOGGLE_SIZE = 26;
const ICON_SIZE = 22;
/* { COLORs } */
const COLORs = {
  dark_theme_onhover_forground: "#494949",
  dark_theme_hidden_forground: "#1E1E1E",
  darK_theme_background: "#181818",

  light_theme_onhover_forground: "#C6C6C6",
  light_theme_hidden_forground: "#D9D9D9",
  light_theme_background: "#F2F2F2",
};
/* CONSTs ---------------------------------------------------------------------------------------------- */

/* SUB COMPONENTs ----------------------------------------------------------------------- SUB COMPONENTs */
const Toggle = () => {
  const { underDarkTheme, setUnderDarkTheme } =
    React.useContext(GlobalContexts);
  const { isOnHover } = React.useContext(ThemeSwitchContexts);
  const [toggleColor, setToggleColor] = useState(null);

  useEffect(() => {
    if (underDarkTheme) {
      setToggleColor(
        isOnHover
          ? COLORs.dark_theme_onhover_forground
          : COLORs.dark_theme_hidden_forground
      );
    } else {
      setToggleColor(
        isOnHover
          ? COLORs.light_theme_onhover_forground
          : COLORs.light_theme_hidden_forground
      );
    }
  }, [isOnHover, underDarkTheme]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: underDarkTheme ? "3px" : "21px",
          height: TOGGLE_SIZE + "px",
          width: TOGGLE_SIZE + "px",
          backgroundColor: toggleColor,
          borderRadius: "24px",
          transition: "0.16s",
          overflow: "hidden",
        }}
      >
        <RiMoonFill
          style={{
            position: "absolute",
            top: "2px",
            left: underDarkTheme ? "2px" : "-32px",
            height: ICON_SIZE + "px",
            width: ICON_SIZE + "px",
            color: underDarkTheme
              ? COLORs.darK_theme_background
              : COLORs.light_theme_background,
            transition: "0.16s",
          }}
        />
        <RiSunFill
          style={{
            position: "absolute",
            top: "2px",
            left: underDarkTheme ? "36px" : "2px",
            height: ICON_SIZE + "px",
            width: ICON_SIZE + "px",
            color: underDarkTheme
              ? COLORs.darK_theme_background
              : COLORs.light_theme_background,
            transition: "0.16s",
          }}
        />
      </div>
    </div>
  );
};
/* SUB COMPONENTs -------------------------------------------------------------------------------------- */

const ThemeSwitch = () => {
  const { underDarkTheme, setUnderDarkTheme } =
    React.useContext(GlobalContexts);
  const [isOnHover, setIsOnHover] = useState(false);

  const [border, setBoard] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = underDarkTheme
      ? COLORs.darK_theme_background
      : "#F2F2F2";
  }, [underDarkTheme]);
  /* { STYLE } */
  useEffect(() => {
    /* { SWITCH BORDER } */
    if (underDarkTheme) {
      if (isOnHover) {
        setBoard("3px solid " + COLORs.dark_theme_onhover_forground);
      } else {
        setBoard("3px solid " + COLORs.dark_theme_hidden_forground);
      }
    } else {
      if (isOnHover) {
        setBoard("3px solid " + COLORs.light_theme_onhover_forground);
      } else {
        setBoard("3px solid " + COLORs.light_theme_hidden_forground);
      }
    }
  }, [isOnHover, underDarkTheme]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        right: "8px",
        height: SWITCH_DIMENSIONS.height + "px",
        width: SWITCH_DIMENSIONS.width + "px",
        border: border,
        borderRadius: "32px",
        transition: "0.16s",
      }}
      onMouseEnter={() => setIsOnHover(true)}
      onMouseLeave={() => setIsOnHover(false)}
      onClick={() => setUnderDarkTheme(!underDarkTheme)}
    >
      <ThemeSwitchContexts.Provider value={{ isOnHover, setIsOnHover }}>
        <Toggle />
      </ThemeSwitchContexts.Provider>
    </div>
  );
};

export default ThemeSwitch;
