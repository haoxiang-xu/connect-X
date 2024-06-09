import React, { useEffect, useRef, useState, useContext } from "react";

import { GLOABL_COLOR_MANAGER } from "../../CONSTs/GlobalColorManager";

import { GlobalContexts } from "../../CONTEXTs/GlobalContexts";

import { RiAddLine, RiSubtractLine } from "@remixicon/react";

const DARK_THEME = GLOABL_COLOR_MANAGER().DARK_THEME;
const LIGHT_THEME = GLOABL_COLOR_MANAGER().LIGHT_THEME;

const BoardDimensionSettingToggle = () => {
  const {
    underDarkTheme,
    boardRows,
    setBoardRows,
    boardColumns,
    setBoardColumns,
  } = useContext(GlobalContexts);
  const SETTING_PANEL_SIZE = 64;
  const [position, setPosition] = useState({
    x: SETTING_PANEL_SIZE / 2,
    y: SETTING_PANEL_SIZE / 2,
  });
  const [transition, setTransition] = useState("background-color 0.16s");
  const [mode, setMode] = useState("NONE"); // ADD_COLUMN, ADD_ROW, SUBTRACT_COLUMN, SUBTRACT_ROW, NONE
  const [displayingText, setDisplayingText] = useState("");
  const [addButtonStyle, setAddButtonStyle] = useState({
    top: "50%",
    left: "50%",
    opacity: "0",
  });
  const [subtractButtonStyle, setSubtractButtonStyle] = useState({
    top: "50%",
    left: "50%",
    opacity: "0",
  });
  const [onClick, setOnClick] = useState(false);

  const handleMouseMove = (event) => {
    setTransition("background-color 0.16s");
    setPosition({
      x: event.clientX - event.target.getBoundingClientRect().left,
      y: event.clientY - event.target.getBoundingClientRect().top,
    });
  };

  useEffect(() => {
    const X = position.x - SETTING_PANEL_SIZE / 2;
    const Y = SETTING_PANEL_SIZE - position.y - SETTING_PANEL_SIZE / 2;

    if (Y > Math.abs(X)) {
      setMode("SUBTRACT_ROW");
    } else if (-Y > Math.abs(X)) {
      setMode("ADD_ROW");
    } else if (X > Math.abs(Y)) {
      setMode("ADD_COLUMN");
    } else if (-X > Math.abs(Y)) {
      setMode("SUBTRACT_COLUMN");
    } else {
      setMode("NONE");
    }
  }, [position]);
  /* { CHECK MODE DEPENDS ON USER CURSOR POSITION} */
  useEffect(() => {
    if (mode === "NONE") {
      setAddButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setSubtractButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setDisplayingText("");
    } else if (mode === "ADD_COLUMN") {
      setAddButtonStyle({
        top: "50%",
        left: "80%",
        opacity: "1",
      });
      setSubtractButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setDisplayingText(boardColumns);
    } else if (mode === "ADD_ROW") {
      setAddButtonStyle({
        top: "80%",
        left: "50%",
        opacity: "1",
      });
      setSubtractButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setDisplayingText(boardRows);
    } else if (mode === "SUBTRACT_COLUMN") {
      setAddButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setSubtractButtonStyle({
        top: "50%",
        left: "20%",
        opacity: "1",
      });
      setDisplayingText(boardColumns);
    } else if (mode === "SUBTRACT_ROW") {
      setAddButtonStyle({
        top: "50%",
        left: "50%",
        opacity: "0",
      });
      setSubtractButtonStyle({
        top: "15%",
        left: "50%",
        opacity: "1",
      });
      setDisplayingText(boardRows);
    }
  }, [mode, boardRows, boardColumns]);
  useEffect(() => {
    if (onClick) {
      if (mode === "ADD_COLUMN" && boardColumns < 10) {
        setBoardColumns(boardColumns + 1);
      } else if (mode === "ADD_ROW" && boardRows < 10) {
        setBoardRows(boardRows + 1);
      } else if (mode === "SUBTRACT_COLUMN" && boardColumns > 1) {
        setBoardColumns(boardColumns - 1);
      } else if (mode === "SUBTRACT_ROW" && boardRows > 1) {
        setBoardRows(boardRows - 1);
      }
      setOnClick(false);
    }
  }, [onClick, mode]);

  return (
    <div
      style={{ position: "absolute", top: "90px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setPosition({ x: SETTING_PANEL_SIZE / 2, y: SETTING_PANEL_SIZE / 2 });
        setTransition(
          "background-color 0.16s, " +
            "top 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72), " +
            "left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)"
        );
      }}
      onClick={() => {
        setOnClick(true);
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0px",
          height: `${SETTING_PANEL_SIZE}px`,
          width: `${SETTING_PANEL_SIZE}px`,
          backgroundColor: underDarkTheme
            ? DARK_THEME.hidden_forground
            : LIGHT_THEME.hidden_forground,
          transition: "0.16s",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `CALC(50% - ${position.y - SETTING_PANEL_SIZE / 2}px)`,
            left: `CALC(50% - ${position.x - SETTING_PANEL_SIZE / 2}px)`,
            transform: "translate(-50%, -50%)",
            height: "50px",
            width: "50px",
            borderRadius: "50px",
            backgroundColor: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
            transition: transition,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "24px",
              fontFamily: "Jost",
              color: underDarkTheme
                ? DARK_THEME.hidden_forground
                : LIGHT_THEME.hidden_forground,
              userSelect: "none",
            }}
          >
            {displayingText}
          </span>
        </div>
        <RiAddLine
          style={{
            position: "absolute",
            top: addButtonStyle.top,
            left: addButtonStyle.left,
            transform: "translate(-50%, -50%)",
            userSelect: "none",
            pointerEvents: "none",
            color: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
            opacity: addButtonStyle.opacity,
            transition:
              "top 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72), " +
              "left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          }}
        />
        <RiSubtractLine
          style={{
            position: "absolute",
            top: subtractButtonStyle.top,
            left: subtractButtonStyle.left,
            transform: "translate(-50%, -50%)",
            userSelect: "none",
            pointerEvents: "none",
            color: underDarkTheme
              ? DARK_THEME.background
              : LIGHT_THEME.background,
            opacity: subtractButtonStyle.opacity,
            transition:
              "top 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72), " +
              "left 0.16s cubic-bezier(0.32, -0.64, 0.32, 1.72)",
          }}
        />
      </div>
    </div>
  );
};

export default BoardDimensionSettingToggle;
