import React, { useEffect, useRef, useState, useContext } from "react";

import { GlobalContexts } from "../../../CONTEXTs/GlobalContexts";

import { GLOABL_COLOR_MANAGER } from "../../../CONSTs/GlobalColorManager";

import { RiLightbulbLine, RiLightbulbFlashLine } from "@remixicon/react";

/* CONSTs --------------------------------------------------------------------------------------- CONSTs */
const SWITCH_DIMENSIONS = { height: 58, width: 129 };
/* { COLORs } */
const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;
/* CONSTs ---------------------------------------------------------------------------------------------- */

const HideOrShowUnlinkableCheckerSwitch = () => {
  const {
    underDarkTheme,
    showUnlinkableCheckerSwitch,
    setShowUnlinkableCheckerSwitch,
  } = useContext(GlobalContexts);

  const [onHover, setOnHover] = useState(false);
  const [border, setBorder] = useState(null);
  const [color, setColor] = useState(null);
  const [topMargin, setTopMargin] = useState(0);

  const [switchText, setSwitchText] = useState("Hide Unlinkable Checkers");

  useEffect(() => {
    if (showUnlinkableCheckerSwitch) {
      setSwitchText("Hide Unlinkable Checkers");
    } else {
      setSwitchText("Show Unlinkable Checkers");
    }
  }, [showUnlinkableCheckerSwitch]);

  useEffect(() => {
    if (onHover) {
      setBorder(
        `3px solid ${
          underDarkTheme
            ? DARK_THEME.onhover_forground
            : LIGHT_THEME.onhover_forground
        }`
      );
      setColor(
        underDarkTheme
          ? DARK_THEME.onhover_forground
          : LIGHT_THEME.onhover_forground
      );
    } else {
      setBorder(
        `3px solid ${
          underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground
        }`
      );
      setColor(
        underDarkTheme
          ? DARK_THEME.hidden_forground
          : LIGHT_THEME.hidden_forground
      );
    }
  }, [underDarkTheme, onHover]);

  return (
    <div
      style={{
        position: "absolute",
        top: "90px",
        right: "0px",
        width: SWITCH_DIMENSIONS.width + "px",
        height: SWITCH_DIMENSIONS.height + "px",
        border: border,
        overflow: "hidden",
        transition: "0.16s",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onClick={() => {
        setTopMargin(64);
        setShowUnlinkableCheckerSwitch(!showUnlinkableCheckerSwitch);
        setTimeout(() => {
          setTopMargin(0);
        }, 160);
      }}
    >
      <span
        style={{
          position: "absolute",
          top: `${topMargin}px`,
          left: "0px",
          padding: "5px",
          lineHeight: "16px",
          fontFamily: "Jost",
          fontSize: "17px",
          fontWeight: "500",
          color: color,
          transition: "0.16s",
          userSelect: "none",
        }}
      >
        {switchText}
      </span>
      {showUnlinkableCheckerSwitch ? (
        <RiLightbulbLine
          style={{
            position: "absolute",
            top: "50%",
            right: "18%",
            topMargin: topMargin,
            transform: "translate(50%, -50%)",
            height: "36px",
            width: "36px",
            color: color,
            transition: "0.16s",
          }}
        />
      ) : (
        <RiLightbulbFlashLine
          style={{
            position: "absolute",
            top: "50%",
            right: "18%",
            topMargin: topMargin,
            transform: "translate(50%, -50%)",
            height: "36px",
            width: "36px",
            color: color,
            transition: "0.16s",
          }}
        />
      )}
    </div>
  );
};

export default HideOrShowUnlinkableCheckerSwitch;
