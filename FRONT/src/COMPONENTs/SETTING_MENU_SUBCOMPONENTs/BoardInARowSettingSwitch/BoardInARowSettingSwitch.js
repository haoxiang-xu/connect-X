import React, { useEffect, useState, useContext } from "react";

import { GlobalContexts } from "../../../CONTEXTs/GlobalContexts";

import { GLOABL_COLOR_MANAGER } from "../../../CONSTs/GlobalColorManager";

import { RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react";

const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;

const BoardInARowSettingSwitch = () => {
  const { inarow, setInarow, boardRows, boardColumns, underDarkTheme } =
    useContext(GlobalContexts);

  const [onHover, setOnHover] = useState(false);
  const [border, setBorder] = useState(null);
  const [color, setColor] = useState(null);

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

  const handleInarowOnAdd = () => {
    if (inarow < boardRows || inarow < boardColumns) {
      setInarow(inarow + 1);
    }
  };
  const handleInarowOnSubtract = () => {
    if (inarow > 1) {
      setInarow(inarow - 1);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "90px",
        left: "74px",
        width: "32px",
        height: "58px",
        border: border,
        overflow: "hidden",
        transition: "0.16s",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: onHover ? "50%" : "-50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          fontFamily: "Jost",
          color: color,

          transition:
            "color 0.16s, left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          userSelect: "none",
        }}
      >
        {inarow}
      </span>
      {inarow < boardRows || inarow < boardColumns ? (
        <RiArrowUpSLine
          style={{
            position: "absolute",
            top: "-3px",
            left: onHover ? "4px" : "-24px",
            color: color,
            transition:
              "color 0.16s, left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          }}
          onClick={handleInarowOnAdd}
        />
      ) : null}
      {inarow > 1 ? (
        <RiArrowDownSLine
          style={{
            position: "absolute",
            bottom: "-3px",
            left: onHover ? "4px" : "-24px",
            color: color,
            transition:
              "color 0.16s, left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          }}
          onClick={handleInarowOnSubtract}
        />
      ) : null}
      <span
        style={{
          position: "absolute",
          top: "20px",
          left: onHover ? "20px" : "0px",
          fontSize: "12px",
          fontFamily: "Jost",
          color: color,
          transform: "rotate(90deg)",
          transition:
            "color 0.16s, left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          userSelect: "none",
        }}
      >
        INAROW
      </span>
    </div>
  );
};

export default BoardInARowSettingSwitch;
