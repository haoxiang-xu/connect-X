import React, { useEffect, useState } from "react";

import { GlobalContexts } from "../../../CONTEXTs/GlobalContexts";
import { ThemeSwitchContexts } from "../../../CONTEXTs/ThemeSwitchContexts";

import { GLOABL_COLOR_MANAGER } from "../../../CONSTs/GlobalColorManager";

import { RiMoonFill, RiSunFill } from "@remixicon/react";

/* CONSTs --------------------------------------------------------------------------------------- CONSTs */
const SWITCH_DIMENSIONS = { height: 32, width: 50 };
const TOGGLE_SIZE = 26;
const ICON_SIZE = 18;
/* { COLORs } */
const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;
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
        isOnHover ? DARK_THEME.onhover_forground : DARK_THEME.hidden_forground
      );
    } else {
      setToggleColor(
        isOnHover ? LIGHT_THEME.onhover_forground : LIGHT_THEME.hidden_forground
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
          transition:
            "background-color 0.16s, left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          overflow: "hidden",
        }}
      >
        <RiMoonFill
          style={{
            position: "absolute",
            top: "4.25px",
            left: underDarkTheme ? "4px" : "-32px",
            height: ICON_SIZE + "px",
            width: ICON_SIZE + "px",
            color: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
            transition: "0.16s",
          }}
        />
        <RiSunFill
          style={{
            position: "absolute",
            top: "4.25px",
            left: underDarkTheme ? "36px" : "4px",
            height: ICON_SIZE + "px",
            width: ICON_SIZE + "px",
            color: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
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
      ? DARK_THEME.background
      : LIGHT_THEME.background;
    document.body.style.transition = "0.16s";
  }, [underDarkTheme]);
  /* { STYLE } */
  useEffect(() => {
    /* { SWITCH BORDER } */
    if (underDarkTheme) {
      if (isOnHover) {
        setBoard("3px solid " + DARK_THEME.onhover_forground);
      } else {
        setBoard("3px solid " + DARK_THEME.hidden_forground);
      }
    } else {
      if (isOnHover) {
        setBoard("3px solid " + LIGHT_THEME.onhover_forground);
      } else {
        setBoard("3px solid " + LIGHT_THEME.hidden_forground);
      }
    }
  }, [isOnHover, underDarkTheme]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        right: "0px",
        height: SWITCH_DIMENSIONS.height + "px",
        width: SWITCH_DIMENSIONS.width + "px",
        border: border,
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
